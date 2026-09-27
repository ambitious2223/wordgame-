/**
 * Direct bridge connector — lets the game talk to a local TikTok bridge
 * (TikFinity or any compatible app) WITHOUT going through the hub.
 *
 * Bridge messages are JSON like:
 *   { "event": "chat",  "data": { "uniqueId": "...", "nickname": "...", "comment": "..." } }
 *   { "event": "gift",  "data": { "uniqueId": "...", "giftName": "...", "count": 1 } }
 *
 * Auto-reconnects with backoff. `WebSocketCtor` can be injected for tests.
 */

export const DEFAULT_BRIDGE_URL = "ws://127.0.0.1:21213/";

/**
 * @param {Record<string, any>} data
 * @returns {{id:string, username:string, name:string, avatar:string}}
 */
function pickUser(data = {}) {
  const rawUser = data.user;
  const u = rawUser && typeof rawUser === "object" ? rawUser : data;
  const stringUser = typeof rawUser === "string" ? rawUser : "";
  const username =
    u.uniqueId || u.username || u.nickname || stringUser ||
    data.uniqueId || data.username || data.nickname || data.name || "";
  const name =
    u.nickname || u.nickName || data.nickname || data.name || stringUser || username || "viewer";
  const id = u.userId || u.id || data.userId || username || stringUser;
  const avatar =
    u.profilePictureUrl || u.avatar || data.profilePictureUrl || data.avatar ||
    (u.profilePicture && u.profilePicture.url && u.profilePicture.url[0]) || "";
  return {
    id: String(id || ""),
    username: String(username || ""),
    name: String(name || ""),
    avatar: String(avatar || "")
  };
}

/**
 * Normalize a raw bridge message into a canonical event (or null).
 * @param {unknown} raw
 * @returns {Record<string, any> | null}
 */
export function normalizeBridgeEvent(raw) {
  let msg = raw;
  if (typeof msg === "string") {
    try {
      msg = JSON.parse(msg);
    } catch {
      return null;
    }
  }
  if (!msg || typeof msg !== "object") return null;
  const m = /** @type {Record<string, any>} */ (msg);

  const eventName = String(m.event || m.type || m.eventName || "").toLowerCase();
  const data = m.data && typeof m.data === "object" ? m.data : m;
  const user = pickUser(data);
  const base = {
    timestamp: Date.now(),
    userId: user.id,
    username: user.username,
    name: user.name,
    avatar: user.avatar
  };

  if (eventName === "chat" || eventName === "comment") {
    const message = data.comment || data.message || data.text || "";
    if (!message) return null;
    return { ...base, type: "chat", message, comment: message };
  }

  if (eventName === "gift") {
    if (Number(data.giftType) === 1 && data.repeatEnd === false) return null;
    return {
      ...base,
      type: "gift",
      giftName: data.giftName || data.gift?.name || "",
      giftId: data.giftId ?? data.gift?.id ?? null,
      coins: Number(data.coins ?? data.diamondCount ?? data.gift?.coinCount ?? 0) || 0,
      count: Math.max(1, Number(data.count ?? data.repeatCount ?? data.giftCount ?? 1) || 1),
      tier: data.tier || "small"
    };
  }

  if (eventName === "like" || eventName === "likes") {
    return { ...base, type: "like", likeCount: Number(data.likeCount || data.count || 1) || 1 };
  }
  if (eventName === "follow" || eventName === "share" || eventName === "social") {
    const action = String(data.actionType || eventName).toLowerCase();
    return { ...base, type: action === "share" ? "share" : "follow" };
  }
  if (eventName === "member" || eventName === "join" || eventName === "roomuser" || eventName === "room_user") {
    return { ...base, type: "member" };
  }
  if (eventName === "subscribe") {
    return { ...base, type: "subscribe" };
  }
  return null;
}

/**
 * Map a canonical bridge event to this game's connector event shape.
 * @param {Record<string, any> | null} n
 * @returns {{type:string, data:any} | null}
 */
function toConnectorEvent(n) {
  if (!n) return null;
  if (n.type === "chat") {
    return { type: "chat", data: { user: n.username || n.name, text: n.message, avatar: n.avatar || null } };
  }
  if (n.type === "gift") {
    return {
      type: "gift",
      data: {
        user: n.username || n.name,
        giftName: n.giftName,
        giftId: n.giftId,
        coins: n.coins,
        count: n.count,
        tier: n.tier,
        avatar: n.avatar || null
      }
    };
  }
  return { type: n.type, data: n };
}

/**
 * @param {{url?: string, WebSocketCtor?: any, enabled?: boolean}} [options]
 */
export function createBridgeConnector(options = {}) {
  const url = options.url || DEFAULT_BRIDGE_URL;
  const Ctor =
    options.WebSocketCtor ??
    /** @type {any} */ (globalThis).WebSocket ??
    null;

  /** @type {Record<string, Array<(payload:any)=>void>>} */
  const handlers = {};
  /** @type {any} */
  let ws = null;
  let connected = false;
  let closed = false;
  let attempt = 0;
  let backoff = 800;
  /** @type {'off'|'connecting'|'connected'|'error'} */
  let state = "off";
  /** @type {ReturnType<typeof setTimeout>|null} */
  let retryTimer = null;

  const emit = (type, data) => {
    for (const fn of handlers[type] ?? []) {
      try {
        fn(data);
      } catch {
        /* ignore listener errors */
      }
    }
  };

  function scheduleRetry() {
    if (closed || retryTimer) return;
    attempt += 1;
    state = "error";
    emit("status", { provider: "bridge", running: false, state, attempt });
    retryTimer = setTimeout(() => {
      retryTimer = null;
      open();
    }, backoff);
    backoff = Math.min(15000, Math.round(backoff * 1.7));
  }

  function open() {
    if (closed) return;
    state = "connecting";
    if (!Ctor) {
      state = "error";
      emit("error", { provider: "bridge", state, message: "WebSocket unavailable" });
      return;
    }
    try {
      ws = new Ctor(url);
    } catch {
      state = "error";
      scheduleRetry();
      return;
    }
    ws.onopen = () => {
      attempt = 0;
      backoff = 800;
      connected = true;
      state = "connected";
      emit("connected", { provider: "bridge", state });
    };
    ws.onmessage = (event) => {
      const normalized = normalizeBridgeEvent(event && event.data);
      const mapped = toConnectorEvent(normalized);
      if (mapped) emit(mapped.type, mapped.data);
    };
    ws.onclose = () => {
      connected = false;
      ws = null;
      if (closed) state = "off";
      else state = "error";
      emit("disconnected", { provider: "bridge", state });
      scheduleRetry();
    };
    ws.onerror = () => {
      /* onclose will follow */
    };
  }

  return {
    get connected() {
      return connected;
    },
    get state() {
      return state;
    },
    on(type, fn) {
      (handlers[type] ??= []).push(fn);
      return () => this.off(type, fn);
    },
    off(type, fn) {
      handlers[type] = (handlers[type] ?? []).filter((f) => f !== fn);
    },
    connect() {
      closed = false;
      open();
      return Promise.resolve(true);
    },
    disconnect() {
      closed = true;
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      if (ws) {
        try {
          ws.close();
        } catch {
          /* ignore */
        }
        ws = null;
      }
      connected = false;
      state = "off";
    }
  };
}

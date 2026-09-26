/**
 * Tikora Hub connector.
 *
 * Loads the hub's shared client (`/hub-client.js`, served by the relay) and maps
 * the hub protocol onto this game's connector events:
 *
 *   hub chat   -> "chat"   { user, text, avatar }
 *   hub gift   -> "gift"   { user, giftName, coins, count, tier, giftId, avatar }
 *   hub effect -> "effect" { id, effect, payload, mappingId, event }
 *   other      -> forwarded by type (follow/like/share/subscribe/member/roomUser)
 *
 * Also exposes reportState() (shown in the hub UI) and ackEffect().
 *
 * `hubFactory` can be injected for tests to avoid loading a real script.
 */

const DEFAULT_WS_URL = "ws://127.0.0.1:27016/";

/**
 * @param {string} wsUrl
 * @returns {string} HTTP URL of the shared hub client for a given relay URL
 */
export function hubClientHttpUrl(wsUrl) {
  try {
    const url = new URL(wsUrl);
    url.protocol = url.protocol === "wss:" ? "https:" : "http:";
    url.pathname = "/hub-client.js";
    url.search = "";
    return url.href;
  } catch {
    return "http://127.0.0.1:27016/hub-client.js";
  }
}

/**
 * Loads `/hub-client.js` into the page and resolves with `globalThis.connectHub`.
 * @param {string} wsUrl
 * @param {number} timeoutMs
 * @returns {Promise<Function>}
 */
export function loadHubClient(wsUrl, timeoutMs = 4000) {
  const scope = /** @type {any} */ (globalThis);
  if (typeof scope.connectHub === "function") return Promise.resolve(scope.connectHub);
  if (typeof document === "undefined") return Promise.reject(new Error("no DOM to load hub-client.js"));

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = hubClientHttpUrl(wsUrl);
    script.async = true;
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      script.remove();
      reject(new Error("hub client load timed out"));
    }, timeoutMs);

    script.onload = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (typeof scope.connectHub === "function") resolve(scope.connectHub);
      else reject(new Error("connectHub missing after load"));
    };
    script.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error("hub client failed to load"));
    };
    document.head.appendChild(script);
  });
}

/**
 * @param {{url?: string, gameSlug?: string, apiKey?: string, hubFactory?: Function, timeoutMs?: number}} [options]
 */
export async function createHubConnector(options = {}) {
  const scope = /** @type {any} */ (globalThis);
  if (scope.__TIKORA_NO_HUB__ && !options.hubFactory) {
    throw new Error("hub disabled (__TIKORA_NO_HUB__)");
  }
  const url = options.url || DEFAULT_WS_URL;
  /** @type {Record<string, Array<(payload:any)=>void>>} */
  const handlers = {};
  let connected = false;

  const emit = (type, data) => {
    for (const fn of handlers[type] ?? []) {
      try {
        fn(data);
      } catch {
        /* ignore listener errors */
      }
    }
  };

  const connectHub =
    options.hubFactory ?? (await loadHubClient(url, options.timeoutMs));

  /** @type {any} */
  const hub = connectHub({
    url,
    // A game needs a valid API key to receive routed *effects*, but the broadcast
    // event stream (chat / gifts / likes / follows) needs no auth. So only
    // identify as a game when we actually have a key — otherwise connect
    // anonymously so comments always arrive (the relay closes keyless game
    // sockets with ?game= that fail auth).
    gameSlug: options.apiKey ? options.gameSlug || undefined : undefined,
    apiKey: options.apiKey || undefined,
    onChat: (ev) => {
      const text = ev.message || ev.comment || "";
      if (!text) return;
      emit("chat", {
        user: ev.username || ev.name || "viewer",
        text,
        avatar: ev.avatar || null
      });
    },
    onGift: (ev) =>
      emit("gift", {
        user: ev.username || ev.name || "viewer",
        giftName: ev.giftName,
        giftId: ev.giftId,
        coins: ev.coins,
        count: ev.count,
        tier: ev.tier,
        avatar: ev.avatar || null
      }),
    onEffect: (ev) => emit("effect", ev),
    onEvent: (ev) => {
      if (!ev || !ev.type) return;
      // chat/gift are normalized above; re-emitting the raw event here would
      // deliver a second, malformed copy (missing `user`/`text`).
      if (ev.type === "chat" || ev.type === "gift") return;
      emit(ev.type, ev);
    },
    onStatus: (status) => emit("status", status),
    onConnect: () => {
      connected = true;
      emit("connected", { provider: "hub" });
    },
    onDisconnect: () => {
      connected = false;
      emit("disconnected", { provider: "hub" });
    },
    onError: (error) => emit("error", { provider: "hub", ...error })
  });

  return {
    get connected() {
      return connected;
    },
    on(type, fn) {
      (handlers[type] ??= []).push(fn);
      return () => this.off(type, fn);
    },
    off(type, fn) {
      handlers[type] = (handlers[type] ?? []).filter((f) => f !== fn);
    },
    connect() {
      // The hub client auto-connects on creation.
      connected = Boolean(hub?.status?.running ?? true);
      return Promise.resolve(true);
    },
    disconnect() {
      connected = false;
      try {
        hub.close();
      } catch {
        /* ignore */
      }
    },
    /** @param {Record<string, any>} data */
    reportState(data) {
      try {
        return hub.reportState(data);
      } catch {
        return false;
      }
    },
    /**
     * @param {string} id
     * @param {Record<string, any>} [result]
     */
    ackEffect(id, result) {
      try {
        return hub.ackEffect(id, result || { ok: true });
      } catch {
        return false;
      }
    },
    /** debug helpers provided by the hub client */
    /** @param {...any} args */
    pushComment(...args) {
      return hub.injectEvent?.({ type: "chat", comment: args[1] ?? args[0], username: args[0] });
    },
    /** @param {...any} args */
    pushGift(...args) {
      return hub.injectGift?.({ giftName: args[1] ?? args[0], username: args[0] });
    }
  };
}

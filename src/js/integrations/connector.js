import { createMockConnector } from "./tiktok.js";
import { createHubConnector } from "./hub-connector.js";
import { createBridgeConnector } from "./bridge-connector.js";

/**
 * Event types forwarded from whichever source(s) are active.
 * @type {string[]}
 */
const FORWARDED_EVENTS = [
  "chat",
  "gift",
  "effect",
  "follow",
  "like",
  "share",
  "subscribe",
  "member",
  "roomUser",
  "status",
  "connected",
  "disconnected",
  "error"
];

/**
 * Connection modes:
 * - `hub`    — the Tikora hub only (`ws://127.0.0.1:27016/`).
 * - `bridge` — a direct TikTok bridge only (TikFinity, `ws://127.0.0.1:21213/`).
 * - `both`   — hub AND bridge together (duplicates de-duplicated).
 * - `mock`   — offline simulator.
 *
 * @typedef {'hub'|'bridge'|'both'|'mock'} ConnectionMode
 */

/**
 * App-level connector facade with a live source registry. Sources can be
 * switched at runtime (see `setMode`).
 *
 * @param {{mode?: ConnectionMode, url?: string, gameSlug?: string, apiKey?: string,
 *   hubFactory?: Function, hubTimeoutMs?: number, bridgeUrl?: string,
 *   bridgeFactory?: Function}} [options]
 */
export function createConnector(options = {}) {
  let mode = options.mode ?? "both";

  /** @type {Record<string, Array<(payload:any)=>void>>} */
  const handlers = {};
  /** @type {Map<string, number>} */
  const recent = new Map();
  /** @type {Map<string, any>} */
  const sources = new Map();

  const emit = (type, data) => {
    for (const fn of handlers[type] ?? []) {
      try {
        fn(data);
      } catch {
        /* a bad listener must not break the connector */
      }
    }
  };

  /**
   * Suppress an identical chat/gift seen from two sources within 3s.
   * @param {string} type
   * @param {any} payload
   */
  function isDuplicate(type, payload) {
    let key = null;
    if (type === "chat") key = `c|${payload?.user}|${payload?.text}`;
    else if (type === "gift") key = `g|${payload?.user}|${payload?.giftName}|${payload?.count}`;
    if (!key) return false;
    const now = Date.now();
    const last = recent.get(key);
    if (last && now - last < 3000) return true;
    recent.set(key, now);
    if (recent.size > 400) recent.clear();
    return false;
  }

  /**
   * @param {string} name
   * @param {any} conn
   */
  function attach(name, conn) {
    for (const type of FORWARDED_EVENTS) {
      if (typeof conn.on !== "function") continue;
      conn.on(type, (payload) => {
        if ((type === "chat" || type === "gift") && isDuplicate(type, payload)) return;
        emit(type, payload);
      });
    }
    sources.set(name, conn);
  }

  function makeHub() {
    return createHubConnector({
      url: options.url,
      gameSlug: options.gameSlug,
      apiKey: options.apiKey,
      hubFactory: options.hubFactory,
      timeoutMs: options.hubTimeoutMs
    });
  }

  /** @param {string} [url] */
  function makeBridge(url) {
    const factory = options.bridgeFactory ?? createBridgeConnector;
    return factory({ url: url || options.bridgeUrl });
  }

  /**
   * @param {'hub'|'bridge'|'mock'} name
   * @param {any} conn
   */
  async function activate(name, conn) {
    // Start the connection first; only register the source if it succeeds so a
    // failed hub/bridge doesn't leave a dead entry in the registry.
    await conn.connect();
    attach(name, conn);
    return conn;
  }

  /**
   * @param {string} url
   * @returns {Promise<boolean>}
   */
  async function connectHub(url) {
    if (url) options.url = url;
    if (sources.has("hub")) disconnectSource("hub");
    try {
      await activate("hub", await makeHub());
      return true;
    } catch (error) {
      emit("error", { provider: "hub", message: String(error?.message ?? error) });
      return false;
    }
  }

  /**
   * @param {string} [url]
   * @returns {Promise<boolean>}
   */
  async function connectBridge(url) {
    if (url) options.bridgeUrl = url;
    if (sources.has("bridge")) disconnectSource("bridge");
    try {
      await activate("bridge", await makeBridge(url));
      return true;
    } catch (error) {
      emit("error", { provider: "bridge", message: String(error?.message ?? error) });
      return false;
    }
  }

  async function connectMock() {
    if (sources.has("mock")) return sources.get("mock");
    return activate("mock", createMockConnector());
  }

  /** @param {string} name */
  function disconnectSource(name) {
    const conn = sources.get(name);
    sources.delete(name);
    if (conn && typeof conn.disconnect === "function") {
      try {
        conn.disconnect();
      } catch {
        /* ignore */
      }
    }
  }

  /** @returns {ConnectionMode} */
  function currentMode() {
    const hasHub = sources.has("hub");
    const hasBridge = sources.has("bridge");
    if (hasHub && hasBridge) return "both";
    if (hasHub) return "hub";
    if (hasBridge) return "bridge";
    if (sources.has("mock")) return "mock";
    return mode;
  }

  /**
   * Switch the active sources at runtime.
   * @param {ConnectionMode} next
   * @param {{hubUrl?: string, bridgeUrl?: string}} [config]
   * @returns {Promise<{ok:boolean, mode:ConnectionMode, sources:Array<{name:string, connected:boolean}>}>}
   */
  async function setMode(next, config = {}) {
    mode = next;
    const unlocked = sources.has("mock") || sources.has("hub") || sources.has("bridge");
    if (unlocked) {
      for (const name of ["hub", "bridge", "mock"]) disconnectSource(name);
    }

    if (next === "mock") {
      await connectMock();
    } else {
      if (next === "hub" || next === "both") await connectHub(config.hubUrl);
      if (next === "bridge" || next === "both") await connectBridge(config.bridgeUrl);
      // An explicit mode with nothing connected falls back to the simulator so
      // the game stays playable; the UI still shows the intended mode.
      if (sources.size === 0) await connectMock();
    }

    emit("connected", { mode: currentMode(), sources: facade.sources });
    emit("status", { mode: currentMode(), sources: facade.sources });
    return { ok: true, mode: currentMode(), sources: facade.sources };
  }

  const facade = {
    get provider() {
      return currentMode();
    },
    get mode() {
      return mode;
    },
    get connected() {
      return [...sources.values()].some((c) => c.connected);
    },
    /** @returns {Array<{name:string, connected:boolean}>} */
    get sources() {
      return [...sources.entries()].map(([name, conn]) => ({
        name,
        connected: Boolean(conn.connected)
      }));
    },
    on(type, fn) {
      (handlers[type] ??= []).push(fn);
      return () => facade.off(type, fn);
    },
    off(type, fn) {
      handlers[type] = (handlers[type] ?? []).filter((f) => f !== fn);
    },
    emit,
    async connect() {
      return setMode(mode, { hubUrl: options.url, bridgeUrl: options.bridgeUrl });
    },
    setMode,
    /** Hub-only helpers. */
    enableHub: (url) => setMode("hub", { hubUrl: url }),
    /** Bridge-only helpers. */
    enableBridge: (url) => setMode("bridge", { bridgeUrl: url }),
    disableBridge() {
      disconnectSource("bridge");
      emit("status", { mode: currentMode(), sources: facade.sources });
    },
    enableMock: () => setMode("mock"),
    disconnect() {
      for (const name of [...sources.keys()]) disconnectSource(name);
      emit("disconnected", { mode });
    },
    /** @param {Record<string, any>} data */
    reportState(data) {
      for (const conn of sources.values()) {
        if (typeof conn.reportState === "function") {
          try {
            return conn.reportState(data);
          } catch {
            /* try next */
          }
        }
      }
      return false;
    },
    /**
     * @param {string} id
     * @param {Record<string, any>} [result]
     */
    ackEffect(id, result) {
      for (const conn of sources.values()) {
        if (typeof conn.ackEffect === "function") {
          try {
            return conn.ackEffect(id, result);
          } catch {
            /* try next */
          }
        }
      }
      return false;
    },
    /** @param {...any} args */
    pushComment(...args) {
      for (const conn of sources.values()) {
        if (typeof conn.pushComment === "function") return conn.pushComment(...args);
      }
      return undefined;
    },
    /** @param {...any} args */
    pushGift(...args) {
      for (const conn of sources.values()) {
        if (typeof conn.pushGift === "function") return conn.pushGift(...args);
      }
      return undefined;
    }
  };

  return facade;
}
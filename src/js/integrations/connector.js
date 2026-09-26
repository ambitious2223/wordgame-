import { createMockConnector } from "./tiktok.js";
import { createHubConnector } from "./hub-connector.js";

/**
 * Event types forwarded from whichever connector is active.
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
  "status"
];

/** @typedef {'auto'|'hub'|'mock'} Provider */

/**
 * App-level connector facade.
 *
 * - `provider: 'mock'` — offline simulator only.
 * - `provider: 'hub'`  — Tikora hub only (errors surface as `error` events).
 * - `provider: 'auto'` — try the hub, fall back to the mock (default).
 *
 * The facade has a stable emitter API (`on`/`off`/`emit`) so the rest of the
 * app never depends on which provider is active.
 *
 * @param {{provider?: Provider, url?: string, gameSlug?: string, apiKey?: string, hubFactory?: Function, hubTimeoutMs?: number}} [options]
 */
export function createConnector(options = {}) {
  const provider = options.provider ?? "auto";
  /** @type {Record<string, Array<(payload:any)=>void>>} */
  const handlers = {};
  /** @type {any} */
  let active = null;
  let activeName = provider === "hub" ? "hub" : "mock";

  const emit = (type, data) => {
    for (const fn of handlers[type] ?? []) {
      try {
        fn(data);
      } catch {
        /* a bad listener must not break the connector */
      }
    }
  };

  function attach(connection) {
    for (const type of FORWARDED_EVENTS) {
      if (typeof connection.on === "function") connection.on(type, (payload) => emit(type, payload));
    }
  }

  const facade = {
    get provider() {
      return activeName;
    },
    get connected() {
      return Boolean(active && active.connected);
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
      if (provider === "mock") {
        active = createMockConnector();
        activeName = "mock";
      } else {
        try {
          active = await createHubConnector({
            url: options.url,
            gameSlug: options.gameSlug,
            apiKey: options.apiKey,
            hubFactory: options.hubFactory,
            timeoutMs: options.hubTimeoutMs
          });
          activeName = "hub";
        } catch (error) {
          if (provider === "hub") {
            activeName = "hub";
            emit("error", { provider: "hub", message: String(error?.message ?? error) });
            emit("status", { running: false, provider: "hub", error: true });
            return false;
          }
          active = createMockConnector();
          activeName = "mock";
          emit("status", { running: false, provider: "mock", fallback: true });
        }
      }

      attach(active);
      await active.connect();
      emit("connected", { provider: activeName });
      return true;
    },
    disconnect() {
      if (active && typeof active.disconnect === "function") active.disconnect();
      emit("disconnected", { provider: activeName });
    },
    /**
     * @param {Record<string, any>} data
     */
    reportState(data) {
      if (active && typeof active.reportState === "function") return active.reportState(data);
      return false;
    },
    /**
     * @param {string} id
     * @param {Record<string, any>} [result]
     */
    ackEffect(id, result) {
      if (active && typeof active.ackEffect === "function") return active.ackEffect(id, result);
      return false;
    },
    /**
     * Test/debug helper (mock + hub debug inject).
     * @param {...any} args
     */
    pushComment(...args) {
      return active?.pushComment?.(...args);
    },
    /**
     * @param {...any} args
     */
    pushGift(...args) {
      return active?.pushGift?.(...args);
    }
  };

  return facade;
}

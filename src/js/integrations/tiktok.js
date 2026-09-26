/**
 * TikTok LIVE connector abstraction.
 *
 * The prototype ships a mock connector so the rest of the game can be wired
 * against a stable interface. A real provider (official LIVE API or a
 * third-party bridge) can be added behind createConnector().
 */
export function createMockConnector() {
  /** @type {Record<string, Array<(payload:any)=>void>>} */
  const listeners = {};

  const api = {
    connected: false,
    /**
     * @param {string} event
     * @param {(payload:any)=>void} callback
     */
    on(event, callback) {
      (listeners[event] ??= []).push(callback);
      return () => api.off(event, callback);
    },
    /**
     * @param {string} event
     * @param {(payload:any)=>void} callback
     */
    off(event, callback) {
      listeners[event] = (listeners[event] ?? []).filter((fn) => fn !== callback);
    },
    /**
     * @param {string} event
     * @param {any} [payload]
     */
    emit(event, payload) {
      for (const fn of listeners[event] ?? []) fn(payload);
    },
    connect() {
      api.connected = true;
      api.emit("connected");
      return Promise.resolve();
    },
    disconnect() {
      api.connected = false;
      api.emit("disconnected");
    },
    /**
     * Test/integration hook: simulates a viewer chat message.
     * @param {string} user
     * @param {string} text
     * @param {string} [avatar]
     */
    pushComment(user, text, avatar) {
      api.emit("chat", avatar ? { user, text, avatar } : { user, text });
    },
    /**
     * Test/integration hook: simulates a gift event.
     * @param {string} user
     * @param {string} giftName
     */
    pushGift(user, giftName) {
      api.emit("gift", { user, giftName });
    }
  };

  return api;
}

/**
 * @param {{provider?: string}} [options]
 */
export function createConnector(options = {}) {
  const provider = options.provider ?? "mock";
  if (provider === "mock") return createMockConnector();
  throw new Error(`Unsupported TikTok provider: ${provider}`);
}

import { describe, it, expect, vi } from "vitest";
import { createConnector } from "../src/js/integrations/connector.js";
import { hubClientHttpUrl } from "../src/js/integrations/hub-connector.js";

/** @returns {{hubFactory: Function, created: any[]}} */
function makeFakeHub() {
  const created = [];
  function hubFactory(options) {
    const api = {
      options,
      status: { running: true },
      connected: false,
      on() {
        return api;
      },
      off() {
        return api;
      },
      connect() {
        api.connected = true;
        return Promise.resolve(true);
      },
      disconnect() {
        api.connected = false;
      },
      reportState: vi.fn(),
      ackEffect: vi.fn(),
      injectEvent: vi.fn(),
      injectGift: vi.fn(),
      close: vi.fn()
    };
    created.push(api);
    return api;
  }
  return { hubFactory, created };
}

/** @returns {{bridgeFactory: Function, created: any[]}} */
function makeFakeBridge() {
  const created = [];
  function bridgeFactory() {
    const handlers = {};
    let connected = false;
    const api = {
      get connected() {
        return connected;
      },
      on(type, fn) {
        (handlers[type] ??= []).push(fn);
        return () => {};
      },
      off() {},
      connect() {
        connected = true;
        return Promise.resolve(true);
      },
      disconnect() {
        connected = false;
      },
      _emit(type, data) {
        for (const fn of handlers[type] ?? []) fn(data);
      }
    };
    created.push(api);
    return api;
  }
  return { bridgeFactory, created };
}

describe("hub client url", () => {
  it("derives the http url from the ws relay url", () => {
    expect(hubClientHttpUrl("ws://127.0.0.1:27016/")).toBe("http://127.0.0.1:27016/hub-client.js");
    expect(hubClientHttpUrl("wss://example.com:1234/")).toBe("https://example.com:1234/hub-client.js");
  });
});

describe("connector facade", () => {
  it("connects via the hub and maps chat/gift/effect events", async () => {
    const { hubFactory, created } = makeFakeHub();
    const connector = createConnector({
      mode: "hub",
      gameSlug: "word-challenge",
      apiKey: "gk_test",
      hubFactory
    });

    const chats = [];
    const gifts = [];
    const effects = [];
    connector.on("chat", (c) => chats.push(c));
    connector.on("gift", (g) => gifts.push(g));
    connector.on("effect", (e) => effects.push(e));

    await connector.connect();
    expect(connector.provider).toBe("hub");
    const hub = created[0];
    expect(hub.options.gameSlug).toBe("word-challenge");
    expect(hub.options.apiKey).toBe("gk_test");

    hub.options.onChat({ username: "sara", message: "بيت", avatar: "a.png" });
    expect(chats[0]).toEqual({ user: "sara", username: "sara", text: "بيت", avatar: "a.png" });

    hub.options.onGift({ username: "omar", giftName: "Galaxy", coins: 1000, count: 3, tier: "epic", giftId: 5 });
    expect(gifts[0]).toMatchObject({ user: "omar", giftName: "Galaxy", coins: 1000, count: 3, tier: "epic" });

    hub.options.onEffect({ id: "e1", effect: "time_bonus", payload: { seconds: 10 } });
    expect(effects[0]).toMatchObject({ id: "e1", effect: "time_bonus" });

    connector.ackEffect("e1", { ok: true });
    expect(hub.ackEffect).toHaveBeenCalledWith("e1", { ok: true });

    connector.reportState({ round: 1 });
    expect(hub.reportState).toHaveBeenCalledWith({ round: 1 });

    // The raw event must not produce a second, malformed chat copy.
    hub.options.onEvent({ type: "chat", username: "sara", comment: "بيت" });
    expect(chats).toHaveLength(1);
  });

  it("connects anonymously (no game slug) when there is no API key, so comments still arrive", async () => {
    const { hubFactory, created } = makeFakeHub();
    const connector = createConnector({ mode: "hub", gameSlug: "word-challenge", hubFactory });
    const chats = [];
    connector.on("chat", (c) => chats.push(c));
    await connector.connect();

    const hub = created[0];
    expect(hub.options.gameSlug).toBeUndefined();
    expect(hub.options.apiKey).toBeUndefined();

    hub.options.onChat({ username: "sara", comment: "كتاب" });
    expect(chats[0]).toEqual({ user: "sara", username: "sara", text: "كتاب", avatar: null });

    // Empty messages are ignored.
    hub.options.onChat({ username: "sara", message: "" });
    expect(chats).toHaveLength(1);
  });

  it("runs the hub AND a direct bridge together, de-duplicating identical chat", async () => {
    const { hubFactory, created } = makeFakeHub();
    const { bridgeFactory, created: bridges } = makeFakeBridge();

    const connector = createConnector({
      mode: "both",
      gameSlug: "word-challenge",
      apiKey: "gk_test",
      hubFactory,
      bridgeFactory
    });
    const chats = [];
    connector.on("chat", (c) => chats.push(c));
    await connector.connect();

    expect(connector.provider).toBe("both");
    expect(connector.sources.map((s) => s.name).sort()).toEqual(["bridge", "hub"]);

    // Same chat arriving from both sources -> only counted once.
    created[0].options.onChat({ username: "sara", message: "بيت" });
    bridges[0]._emit("chat", { user: "sara", text: "بيت", avatar: null });
    expect(chats).toHaveLength(1);
  });

  it("switches connection mode at runtime", async () => {
    const { hubFactory } = makeFakeHub();
    const { bridgeFactory } = makeFakeBridge();
    const connector = createConnector({ mode: "hub", hubFactory, bridgeFactory });
    await connector.connect();
    expect(connector.provider).toBe("hub");

    await connector.setMode("bridge");
    expect(connector.provider).toBe("bridge");
    expect(connector.sources.map((s) => s.name)).toEqual(["bridge"]);

    await connector.setMode("both");
    expect(connector.provider).toBe("both");

    await connector.setMode("mock");
    expect(connector.provider).toBe("mock");
  });

  it("falls back to the mock source when auto finds nothing", async () => {
    const connector = createConnector({
      mode: "hub",
      hubFactory: () => {
        throw new Error("hub down");
      }
    });
    const errors = [];
    connector.on("error", (e) => errors.push(e));
    await connector.connect();
    expect(errors[0].provider).toBe("hub");
    expect(connector.provider).toBe("mock");
  });
});
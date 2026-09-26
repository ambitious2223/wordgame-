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
      on() {
        return api;
      },
      off() {
        return api;
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
      provider: "hub",
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
    expect(chats[0]).toEqual({ user: "sara", text: "بيت", avatar: "a.png" });

    hub.options.onGift({ username: "omar", giftName: "Galaxy", coins: 1000, count: 3, tier: "epic", giftId: 5 });
    expect(gifts[0]).toMatchObject({ user: "omar", giftName: "Galaxy", coins: 1000, count: 3, tier: "epic" });

    hub.options.onEffect({ id: "e1", effect: "time_bonus", payload: { seconds: 10 } });
    expect(effects[0]).toMatchObject({ id: "e1", effect: "time_bonus" });

    connector.ackEffect("e1", { ok: true });
    expect(hub.ackEffect).toHaveBeenCalledWith("e1", { ok: true });

    connector.reportState({ round: 1 });
    expect(hub.reportState).toHaveBeenCalledWith({ round: 1 });
  });

  it("falls back to the mock provider when the hub is unavailable (auto)", async () => {
    const connector = createConnector({
      provider: "auto",
      hubFactory: () => {
        throw new Error("hub down");
      }
    });
    const statuses = [];
    connector.on("status", (s) => statuses.push(s));
    await connector.connect();
    expect(connector.provider).toBe("mock");
    expect(statuses.some((s) => s && s.fallback)).toBe(true);
  });

  it("reports an error and stays on hub when provider is 'hub'", async () => {
    const connector = createConnector({
      provider: "hub",
      hubFactory: () => {
        throw new Error("hub down");
      }
    });
    const errors = [];
    connector.on("error", (e) => errors.push(e));
    const ok = await connector.connect();
    expect(ok).toBe(false);
    expect(connector.provider).toBe("hub");
    expect(errors[0].provider).toBe("hub");
  });
});

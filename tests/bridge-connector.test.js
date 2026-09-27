import { describe, it, expect, beforeEach } from "vitest";
import { createBridgeConnector, normalizeBridgeEvent } from "../src/js/integrations/bridge-connector.js";

class FakeWS {
  static instances = [];
  constructor(url) {
    this.url = url;
    this.readyState = 0;
    this.sent = [];
    FakeWS.instances.push(this);
  }
  send(msg) {
    this.sent.push(msg);
  }
  close() {
    this.readyState = 3;
    if (this.onclose) this.onclose({});
  }
  _open() {
    this.readyState = 1;
    if (this.onopen) this.onopen({});
  }
  _msg(obj) {
    if (this.onmessage) this.onmessage({ data: JSON.stringify(obj) });
  }
}

beforeEach(() => {
  FakeWS.instances.length = 0;
});

describe("normalizeBridgeEvent", () => {
  it("normalizes a TikFinity-style chat message", () => {
    const ev = normalizeBridgeEvent({
      event: "chat",
      data: { uniqueId: "sara", nickname: "Sara", comment: "بيت", profilePictureUrl: "a.png" }
    });
    expect(ev).toMatchObject({
      type: "chat",
      username: "sara",
      name: "Sara",
      message: "بيت",
      avatar: "a.png"
    });
  });

  it("normalizes gifts, likes, follows and rejects empty chat", () => {
    expect(
      normalizeBridgeEvent({ event: "gift", data: { uniqueId: "omar", giftName: "Galaxy", count: 3, diamondCount: 1000 } })
    ).toMatchObject({ type: "gift", username: "omar", giftName: "Galaxy", count: 3, coins: 1000 });
    expect(normalizeBridgeEvent({ event: "like", data: { uniqueId: "x", count: 5 } })).toMatchObject({ type: "like" });
    expect(normalizeBridgeEvent({ event: "follow", data: { uniqueId: "x" } })).toMatchObject({ type: "follow" });
    expect(normalizeBridgeEvent({ event: "chat", data: { uniqueId: "x", comment: "" } })).toBeNull();
    expect(normalizeBridgeEvent("not json")).toBeNull();
  });
});

describe("bridge connector", () => {
  it("connects directly and emits normalized chat", async () => {
    const bridge = createBridgeConnector({ url: "ws://127.0.0.1:21213/", WebSocketCtor: FakeWS });
    const chats = [];
    bridge.on("chat", (c) => chats.push(c));
    await bridge.connect();

    const ws = FakeWS.instances[0];
    expect(ws.url).toBe("ws://127.0.0.1:21213/");
    ws._open();
    expect(bridge.connected).toBe(true);

    ws._msg({ event: "chat", data: { uniqueId: "sara", nickname: "Sara", comment: "بيت", profilePictureUrl: "a.png" } });
    expect(chats[0]).toEqual({ user: "Sara", username: "sara", text: "بيت", avatar: "a.png" });

    bridge.disconnect();
    expect(bridge.connected).toBe(false);
  });

  it("is a safe no-op without a WebSocket implementation", () => {
    const bridge = createBridgeConnector({ WebSocketCtor: null });
    expect(() => bridge.connect()).not.toThrow();
    expect(bridge.connected).toBe(false);
  });
});

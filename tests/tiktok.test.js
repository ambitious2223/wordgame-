import { describe, it, expect, vi } from "vitest";
import { createMockConnector, createConnector } from "../src/js/integrations/tiktok.js";

describe("TikTok mock connector", () => {
  it("emits connection lifecycle events", async () => {
    const connector = createMockConnector();
    const onConnect = vi.fn();
    connector.on("connected", onConnect);
    await connector.connect();
    expect(connector.connected).toBe(true);
    expect(onConnect).toHaveBeenCalledOnce();
    connector.disconnect();
    expect(connector.connected).toBe(false);
  });

  it("forwards chat and gift events", () => {
    const connector = createMockConnector();
    const onChat = vi.fn();
    const onGift = vi.fn();
    connector.on("chat", onChat);
    connector.on("gift", onGift);
    connector.pushComment("sara", "بيت");
    connector.pushGift("omar", "Rose");
    expect(onChat).toHaveBeenCalledWith({ user: "sara", text: "بيت" });
    expect(onGift).toHaveBeenCalledWith({ user: "omar", giftName: "Rose" });
  });

  it("unsubscribes via the returned disposer", () => {
    const connector = createMockConnector();
    const onChat = vi.fn();
    const off = connector.on("chat", onChat);
    off();
    connector.pushComment("sara", "بيت");
    expect(onChat).not.toHaveBeenCalled();
  });

  it("rejects unsupported providers", () => {
    expect(() => createConnector({ provider: "other" })).toThrow();
    expect(createConnector().connected).toBe(false);
  });
});
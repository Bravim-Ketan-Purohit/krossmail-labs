import { describe, it, expect } from "vitest";
import { buildServer } from "../src/server.js";

describe("sync-service /health", () => {
  it("returns ok", async () => {
    const app = buildServer();
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok", service: "sync-service" });
    await app.close();
  });
});

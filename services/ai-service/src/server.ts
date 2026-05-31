import Fastify, { type FastifyInstance } from "fastify";

/** Builds the ai-service Fastify app. Every Kross service exposes /health. */
export function buildServer(): FastifyInstance {
  const app = Fastify({ logger: false });

  app.get("/health", async () => ({ status: "ok", service: "ai-service" }));

  return app;
}

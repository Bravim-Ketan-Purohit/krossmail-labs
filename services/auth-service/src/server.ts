import Fastify, { type FastifyInstance } from "fastify";

/** Builds the auth-service Fastify app. Every Kross service exposes /health. */
export function buildServer(): FastifyInstance {
  const app = Fastify({ logger: false });

  app.get("/health", async () => ({ status: "ok", service: "auth-service" }));

  return app;
}

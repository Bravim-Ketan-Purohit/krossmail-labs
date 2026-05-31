import { buildServer } from "./server.js";

const port = Number(process.env.PORT ?? 3002);

buildServer()
  .listen({ port, host: "0.0.0.0" })
  .then(() => console.log("sync-service listening on :" + port))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

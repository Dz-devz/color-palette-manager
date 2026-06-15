import { createServer } from "http";
import app from "./app";
import { env } from "./env";

const server = createServer(app);

server.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
}

(["SIGINT", "SIGTERM"] as const).forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

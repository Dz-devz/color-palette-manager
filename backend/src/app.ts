import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./env";
import { routes } from "./controllers/routes";
import { errorHandler } from "./middlewares/error-handler";
import { notFoundHandler } from "./middlewares/not-found";

const app = express();

const allowedOrigins = env.CLIENT_URL.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

routes.forEach((route) => {
  app.use("/api", route);
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;

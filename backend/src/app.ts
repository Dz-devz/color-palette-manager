import cors from "cors";
import express from "express";
import helmet from "helmet";
import { routes } from "./controllers/routes";
import { errorHandler } from "./middlewares/error-handler";
import { notFoundHandler } from "./middlewares/not-found";

const app = express();

app.use(helmet());
app.use(cors());
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

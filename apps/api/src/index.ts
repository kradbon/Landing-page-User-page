import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDb } from "./db";
import { config } from "./config";
import publicRoutes from "./routes/public";
import adminRoutes from "./routes/admin";
import { tenantAuth, requireTenant } from "./middleware/auth";

async function start() {
  await connectDb();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/public", publicRoutes);
  app.use("/admin", tenantAuth, requireTenant, adminRoutes);

  app.listen(config.port, () => {
    console.log(`API listening on ${config.port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

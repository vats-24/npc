import express from "express";
import dashboardRoutes from "./routes/index";
import cors from "cors";
import { redisClient } from "./database/redis";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/webhook", async (req, res) => {
  const transactions = req.body;

  console.log(`Received webhook with ${transactions.length} transaction(s)`);

  for (const tx of transactions) {
    await redisClient.lPush("transaction-queue", JSON.stringify(tx));
  }

  res.status(200).send("OK");
});

export function startWebhookServer() {
  app.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`);
    console.log(`Your webhook URL is ${PORT}/webhook`);
  });
}

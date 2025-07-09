import { startWebhookServer } from "./server";
import "./config/env";
import { connectRedis } from "./database/redis";

async function main() {
  console.log("TokenWise Backend Starting");

  connectRedis();

  startWebhookServer();

  console.log("\nApplication is running. Waiting for webhooks");
  console.log("Use CTRL+C to stop.");
}

main().catch((error) => {
  console.error("Fatal error during application startup:", error);
  process.exit(1);
});

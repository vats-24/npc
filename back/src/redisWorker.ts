import { processHeliusTransaction } from "./services/transactionDecoder";
import { redisClient, connectRedis } from "./database/redis";
import "./config/env";

async function startWorker() {
  await connectRedis();
  console.log("Worker is running and waiting for jobs...");

  while (true) {
    try {
      const result = await redisClient.brPop("transaction-queue", 0);

      if (result) {
        const transaction = JSON.parse(result.element);
        console.log(
          `Processing job for signature ${transaction.signature.slice(0, 10)}`
        );
        await processHeliusTransaction(transaction);
      }
    } catch (error) {
      console.error("Error processing a job:", error);
    }
  }
}

startWorker();

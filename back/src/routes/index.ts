import express from "express";
import prisma from "../database/db";
import lod from "lodash";
const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const totalBuys = await prisma.transaction.count({
      where: { transactionType: "BUY" },
    });
    const totalSells = await prisma.transaction.count({
      where: { transactionType: "SELL" },
    });

    const protocolUsageRaw = await prisma.transaction.groupBy({
      by: ["protocol"],
      _count: { protocol: true },
      where: { protocol: { not: null, notIn: ["Unknown"] } },
      orderBy: { _count: { protocol: "desc" } },
    });

    const protocolUsage = protocolUsageRaw.map((p) => ({
      protocol: p.protocol,
      transaction_count: p._count.protocol,
    }));

    const summary = {
      totalBuys,
      totalSells,
      netDirection: totalBuys - totalSells,
      protocolUsage,
    };

    res.json(summary);
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/recent-transactions", async (req, res) => {
  const limit = parseInt(req.query.limit as string, 10) || 25;
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/most-active-wallets", async (req, res) => {
  try {
    const activeWallets = await prisma.transaction.groupBy({
      by: ["walletAddress"],
      _count: { _all: true },
      orderBy: { _count: { walletAddress: "desc" } },
      take: 20,
    });

    const result = activeWallets.map((w) => ({
      wallet_address: w.walletAddress,
      transaction_count: w._count._all,
    }));
    res.json(result);
  } catch (error) {
    console.error("Error fetching most active wallets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/history", async (req, res) => {
  const { startTime, endTime, walletAddress, format = "json" } = req.query;

  try {
    const whereClause: any = { AND: [] };

    if (startTime)
      whereClause.AND.push({
        timestamp: { gte: new Date(startTime as string) },
      });
    if (endTime)
      whereClause.AND.push({ timestamp: { lte: new Date(endTime as string) } });
    if (walletAddress)
      whereClause.AND.push({ walletAddress: walletAddress as string });

    const data = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { timestamp: "desc" },
    });

    if (format === "csv") {
      if (data.length === 0) {
        return res.status(200).send("No data found for the given criteria.");
      }
      const fields = Object.keys(data[0]);
      const csvHeader = fields.join(",");
      const csvBody = data
        //@ts-ignore
        .map((row) => fields.map((field) => `"${row[field]}"`).join(","))
        .join("\n");
      const csv = `${csvHeader}\n${csvBody}`;

      res.header("Content-Type", "text/csv");
      res.attachment("transaction_history.csv");
      return res.send(csv);
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/top-holders", async (req, res) => {
  try {
    const topHolders = await prisma.topWallet.findMany();

    const top = lod.cloneDeepWith(
      topHolders,
      (value: { toString: () => any }) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
      }
    );
    console.log(topHolders.slice(0, 10));
    res.json(top);
  } catch (error) {
    console.error("Error fetching top holders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

import prisma from "../database/db";
import { getTopHolders } from "../services/solana";
import { Holder } from "../types";
import { rpc } from "../../supply";

const TARGET_TOKEN_MINT = "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump";
const HOLDER_LIMIT = 60;

async function topHolders() {
  try {
    const holders = await getTopHolders(TARGET_TOKEN_MINT, HOLDER_LIMIT);

    /*
    const holders = rpc?.result?.value.slice(0, 60).map((account: any) => ({
      address: account.address,
      uiAmount: account.uiAmount,
      tokenQuantity: BigInt(account.amount),
    }));
    */

    for (const holder of holders) {
      await prisma.topWallet.upsert({
        where: { walletAddress: holder.address },
        update: {
          tokenQuantity: BigInt(holder.tokenQuantity),
          initialBalanceUi: holder.uiAmount,
          lastCheckedAt: new Date(),
        },
        create: {
          walletAddress: holder.address,
          tokenQuantity: BigInt(holder.tokenQuantity),
          tokenMint: TARGET_TOKEN_MINT,
          initialBalanceUi: holder.uiAmount,
        },
      });
    }
  } catch (error) {
    console.error("Failed to fetch top holders:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

topHolders();

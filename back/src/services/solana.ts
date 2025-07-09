import { HELIUS_API_KEY } from "../config/env";
import { Holder } from "../types";

const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export async function getTopHolders(
  mintAddress: string,
  limit: number = 60
): Promise<Holder[]> {
  try {
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "id",
        method: "getTokenLargestAccounts",
        params: [mintAddress],
      }),
    });

    const { result } = await response.json();

    if (!result || !result.value) {
      throw new Error("Failed to fetch token holders or no holders found.");
    }

    const holders: Holder[] = result.value
      .slice(0, limit)
      .map((account: any) => ({
        address: account.address,
        uiAmount: account.uiAmount,
      }));

    return holders;
  } catch (error) {
    console.error("Failed to fetch token holders:", error);
    throw error;
  }
}

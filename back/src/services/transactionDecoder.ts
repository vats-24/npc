import prisma from "../database/db";

const TARGET_TOKEN_MINT = "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump";

interface HeliusTransaction {
  signature: string;
  timestamp: number;
  tokenTransfers: {
    fromUserAccount?: string;
    toUserAccount?: string;
    mint: string;
    tokenAmount: number;
  }[];
  accountData: {
    account: string;
    nativeBalanceChange: number;
  }[];
  source: string;
  description: string;
}

export async function processHeliusTransaction(tx: HeliusTransaction) {
  console.log(
    `[${tx.signature.slice(0, 10)}...] Description: ${tx?.description}`
  );

  const walletAddress = findOurWalletInTx(tx);
  if (!walletAddress) {
    return;
  }

  let ourTokenTransfer = null;
  let solTransferAmount = 0;

  for (const transfer of tx.tokenTransfers) {
    if (transfer.mint === TARGET_TOKEN_MINT) {
      ourTokenTransfer = transfer;
      break;
    }
  }

  if (!ourTokenTransfer) {
    return;
  }

  const isBuy = ourTokenTransfer.toUserAccount === walletAddress;
  const transactionType = isBuy ? "BUY" : "SELL";

  const nativeBalanceChange =
    tx.accountData.find((ad) => ad.account === walletAddress)
      ?.nativeBalanceChange || 0;
  solTransferAmount = Math.abs(nativeBalanceChange / 1e9);

  const tokenAmount = ourTokenTransfer.tokenAmount;
  const protocol = tx.source || "Unknown";
  const timestamp = new Date(tx.timestamp * 1000).toISOString();

  console.log(`
    Decoded Transaction:
      - Wallet: ${walletAddress}
      - Type: ${transactionType}
      - Token Amount: ${tokenAmount.toFixed(4)}
      - SOL Amount: ${solTransferAmount.toFixed(4)}
      - Protocol: ${protocol}
      - Signature: ${tx.signature}
    `);

  await saveTransactionToDb({
    signature: tx.signature,
    walletAddress,
    timestamp,
    transactionType,
    tokenAmountUi: tokenAmount,
    solAmountUi: solTransferAmount,
    protocol,
  });
}

function findOurWalletInTx(tx: HeliusTransaction): string | null {
  for (const transfer of tx.tokenTransfers) {
    if (transfer.mint === TARGET_TOKEN_MINT) {
      if (transfer.fromUserAccount) return transfer.fromUserAccount;
      if (transfer.toUserAccount) return transfer.toUserAccount;
    }
  }
  return null;
}

interface TxData {
  signature: string;
  walletAddress: string;
  timestamp: string;
  transactionType: string;
  tokenAmountUi: number;
  solAmountUi: number;
  protocol: string;
}

async function saveTransactionToDb(data: TxData) {
  try {
    await prisma.transaction.create({
      data: {
        signature: data.signature,
        timestamp: new Date(data.timestamp),
        transactionType: data.transactionType,
        tokenAmountUi: data.tokenAmountUi,
        solAmountUi: data.solAmountUi,
        protocol: data.protocol,
        walletAddress: data.walletAddress,
      },
    });
    console.log(`[DB] Saved transaction ${data.signature.slice(0, 10)}...`);
  } catch (error: any) {
    if (error.code === "P2002") {
      console.log(
        `[DB] Transaction ${data.signature.slice(
          0,
          10
        )}... already exists. Skipping.`
      );
    } else {
      console.error(`[DB] Error saving transaction ${data.signature}:`, error);
    }
  }
}

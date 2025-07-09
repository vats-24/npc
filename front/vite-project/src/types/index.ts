export interface ProtocolUsage {
  protocol: string;
  transaction_count: number;
}

export interface SummaryData {
  totalBuys: number;
  totalSells: number;
  netDirection: number;
  protocolUsage: ProtocolUsage[];
}

export interface Trade {
  id: number;
  signature: string;
  walletAddress: string;
  timestamp: string;
  transactionType: "BUY" | "SELL";
  tokenAmountUi: number;
  solAmountUi: number;
  protocol: string | null;
}

export interface ActiveWallet {
  wallet_address: string;
  transaction_count: number;
}

export interface TopHolder {
  id: number;
  walletAddress: string;
  tokenMint: string;
  initialBalanceUi: number;
  lastCheckedAt: string;
}

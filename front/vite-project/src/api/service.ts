import type {
  SummaryData,
  Trade,
  ActiveWallet,
  TopHolder,
} from "../types/index";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    throw error;
  }
}

export const getHistory = async (filters: {
  startTime?: string;
  endTime?: string;
  walletAddress?: string;
}): Promise<Trade[]> => {
  const params = new URLSearchParams();
  if (filters.startTime)
    params.append("startTime", new Date(filters.startTime).toISOString());
  if (filters.endTime)
    params.append("endTime", new Date(filters.endTime).toISOString());
  if (filters.walletAddress)
    params.append("walletAddress", filters.walletAddress);

  return fetchFromApi(`/history?${params.toString()}`);
};

export const getSummaryData = (): Promise<SummaryData> =>
  fetchFromApi("/summary");
export const getRecentTrades = (limit = 20): Promise<Trade[]> =>
  fetchFromApi(`/recent-transactions?limit=${limit}`);
export const getActiveWallets = (): Promise<ActiveWallet[]> =>
  fetchFromApi("/most-active-wallets");
export const getTopHolders = (): Promise<TopHolder[]> =>
  fetchFromApi("/top-holders");

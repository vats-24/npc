import React, { useState } from "react";
import Card from "../ui/card";
import { getHistory } from "../../api/service";
import type { Trade } from "../../types";
import { formatAddress, formatNumber } from "../../utils/formatters";
import { ExternalLink, Search, Download } from "lucide-react";

const HistoricalSearch = () => {
  const [filters, setFilters] = useState({
    startTime: "",
    endTime: "",
    walletAddress: "",
  });
  const [results, setResults] = useState<Trade[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await getHistory(filters);
      setResults(data);
    } catch (err) {
      setError("Failed to fetch historical data.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (filters.startTime)
      params.append("startTime", new Date(filters.startTime).toISOString());
    if (filters.endTime)
      params.append("endTime", new Date(filters.endTime).toISOString());
    if (filters.walletAddress)
      params.append("walletAddress", filters.walletAddress);
    params.append("format", "csv");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const url = `${API_BASE_URL}/history?${params.toString()}`;

    window.open(url, "_blank");
  };

  return (
    <Card title="Historical Data Explorer" className="col-span-1 lg:col-span-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          name="startTime"
          value={filters.startTime}
          onChange={handleFilterChange}
          className="bg-neutral-900 border border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <input
          type="date"
          name="endTime"
          value={filters.endTime}
          onChange={handleFilterChange}
          className="bg-neutral-900 border border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <input
          type="text"
          name="walletAddress"
          placeholder="Filter by Wallet Address"
          value={filters.walletAddress}
          onChange={handleFilterChange}
          className="md:col-span-2 bg-neutral-900 border border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center justify-center w-full md:w-auto bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          <Search size={18} className="mr-2" />
          {loading ? "Searching..." : "Search"}
        </button>
        <button
          onClick={handleExport}
          disabled={!results || results.length === 0}
          className="flex items-center justify-center w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          <Download size={18} className="mr-2" />
          Export CSV
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {results && (
        <div className="overflow-x-auto mt-4">
          <p className="text-sm text-neutral-400 mb-2">
            {results.length} record(s) found.
          </p>
          <table className="w-full text-sm text-left text-neutral-400">
            <thead className="text-xs text-neutral-400 uppercase bg-neutral-900/50">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Time
                </th>
                <th scope="col" className="px-4 py-3">
                  Type
                </th>
                <th scope="col" className="px-4 py-3">
                  Maker
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Token Amount
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  SOL Amount
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Tx
                </th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-neutral-500">
                    No data found for the selected filters.
                  </td>
                </tr>
              ) : (
                results.map((tx: Trade) => (
                  <tr
                    key={tx.signature}
                    className="border-b border-neutral-800 hover:bg-neutral-800/60"
                  >
                    <td className="px-4 py-3 text-neutral-300">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-3 font-bold ${
                        tx.transactionType === "BUY"
                          ? "text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      {tx.transactionType}
                    </td>
                    <td className="px-4 py-3 font-mono text-blue-400">
                      {formatAddress(tx.walletAddress)}
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-300 text-right">
                      {formatNumber(tx.tokenAmountUi)}
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-300 text-right">
                      {parseFloat(tx.solAmountUi).toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={`https://solscan.io/tx/${tx.signature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4 inline-block" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default HistoricalSearch;

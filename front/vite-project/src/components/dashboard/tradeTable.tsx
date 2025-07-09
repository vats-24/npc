import Card from "../ui/card";
import { useDataFetching } from "../../hooks/fetchData";
import { getRecentTrades } from "../../api/service";
import { formatAddress, formatNumber } from "../../utils/formatters";
import { ExternalLink } from "lucide-react";
import type { Trade } from "../../types";

const TradesTable = () => {
  const { data: trades, loading } = useDataFetching(getRecentTrades, 15000);

  return (
    <Card title="Recent Trades" className="col-span-1 md:col-span-3">
      <div className="overflow-x-auto">
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
              <th scope="col" className="px-4 py-3">
                Protocol
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Tx
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="text-center p-8 text-neutral-500">
                  Loading trades...
                </td>
              </tr>
            )}
            {!loading &&
              trades?.map((tx: Trade) => (
                <tr
                  key={tx.signature}
                  className="border-b border-neutral-800 hover:bg-neutral-800/60"
                >
                  <td className="px-4 py-3 text-neutral-300">
                    {new Date(tx.timestamp).toLocaleTimeString()}
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
                  <td className="px-4 py-3 capitalize">
                    {tx.protocol?.toLowerCase()}
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
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TradesTable;

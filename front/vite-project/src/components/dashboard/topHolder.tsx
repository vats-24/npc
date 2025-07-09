import Card from "../ui/card";
import { useDataFetching } from "../../hooks//fetchData";
import { getTopHolders } from "../../api/service";
import type { TopHolder } from "../../types";
import { formatNumber } from "../../utils/formatters";
import { ExternalLink } from "lucide-react";

const TopHoldersTable = () => {
  const { data: holders, loading } = useDataFetching(getTopHolders);
  return (
    <Card title="Top Token Holders" className="col-span-1 lg:col-span-3">
      <div className="overflow-x-auto max-h-96">
        {" "}
        <table className="w-full text-sm text-left text-neutral-400">
          <thead className="text-xs text-neutral-400 uppercase bg-neutral-900 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 text-center">
                Rank
              </th>
              <th scope="col" className="px-4 py-3">
                Address
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Balance
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="text-center p-8 text-neutral-500">
                  Loading top holders...
                </td>
              </tr>
            )}
            {!loading &&
              holders?.map((holder: TopHolder, index: number) => (
                <tr
                  key={holder.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/60"
                >
                  <td className="px-4 py-3 text-center">
                    <span className="bg-neutral-700 text-neutral-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-400">
                    {holder.walletAddress}
                  </td>
                  <td className="px-4 py-3 font-mono text-neutral-300 text-right">
                    {formatNumber(holder.initialBalanceUi)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a
                      href={`https://solscan.io/account/${holder.walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                      title="View on Solscan"
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

export default TopHoldersTable;

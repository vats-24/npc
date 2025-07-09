import React from "react";
import Card from "../ui/card";
import { useDataFetching } from "../../hooks/fetchData";
import { getSummaryData } from "../../api/service";
import { formatNumber } from "../../utils/formatters";
import { ArrowUp, ArrowDown, ArrowRightLeft } from "lucide-react";

const Kpi: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}> = ({ label, value, icon, colorClass }) => (
  <div className="flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>{icon}</div>
    <div>
      <p className="text-sm text-neutral-400">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  </div>
);

const KpiGrid = () => {
  const {
    data: summary,
    loading,
    error,
  } = useDataFetching(getSummaryData, 30000);

  const netDirectionColor =
    summary?.netDirection === 0
      ? "text-neutral-400"
      : summary?.netDirection ?? 0 > 0
      ? "text-green-400"
      : "text-red-500";
  const netDirectionIcon =
    summary?.netDirection === 0 ? (
      <ArrowRightLeft size={24} />
    ) : summary?.netDirection ?? 0 > 0 ? (
      <ArrowUp size={24} />
    ) : (
      <ArrowDown size={24} />
    );

  return (
    <Card title="Activity Snapshot" className="col-span-1 md:col-span-3">
      {loading && (
        <div className="text-center text-neutral-400">Loading KPIs...</div>
      )}
      {error && <div className="text-center text-red-500">{error}</div>}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full content-center">
          <Kpi
            label="Total Buys"
            value={formatNumber(summary.totalBuys)}
            icon={<ArrowUp size={24} />}
            colorClass="text-green-400"
          />
          <Kpi
            label="Total Sells"
            value={formatNumber(summary.totalSells)}
            icon={<ArrowDown size={24} />}
            colorClass="text-red-500"
          />
          <Kpi
            label="Net Direction"
            value={
              summary.netDirection > 0
                ? `+${formatNumber(summary.netDirection)}`
                : formatNumber(summary.netDirection)
            }
            icon={netDirectionIcon}
            colorClass={netDirectionColor}
          />
        </div>
      )}
    </Card>
  );
};

export default KpiGrid;

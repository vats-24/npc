import Card from "../ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { useDataFetching } from "../../hooks/fetchData";
import { getActiveWallets } from "../../api/service";
import { formatAddress } from "../../utils/formatters";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const ActiveWalletsChart = () => {
  const { data: wallets, loading } = useDataFetching(getActiveWallets);

  const chartData = {
    labels: wallets?.map((w) => formatAddress(w.wallet_address)) || [],
    datasets: [
      {
        label: "Transactions",
        data: wallets?.map((w) => w.transaction_count) || [],
        backgroundColor: "rgba(34, 197, 94, 0.4)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#a3a3a3" }, grid: { color: "#404040" } },
      y: { ticks: { color: "#a3a3a3" }, grid: { display: false } },
    },
  };

  return (
    <Card title="Most Active Wallets">
      <div className="h-48 md:h-64 flex items-center justify-center">
        {loading && <div className="text-neutral-400">Loading Chart...</div>}
        {!loading && wallets && <Bar data={chartData} options={options} />}
      </div>
    </Card>
  );
};

export default ActiveWalletsChart;

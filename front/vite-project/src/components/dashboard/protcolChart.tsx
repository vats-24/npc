import Card from "../ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDataFetching } from "../../hooks/fetchData";
import { getSummaryData } from "../../api/service";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProtocolChart = () => {
  const { data: summary, loading } = useDataFetching(getSummaryData);

  const chartData = {
    labels: summary?.protocolUsage.map((p) => p.protocol) || [],
    datasets: [
      {
        data: summary?.protocolUsage.map((p) => p.transaction_count) || [],
        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#eab308",
          "#ec4899",
          "#8b5cf6",
        ],
        borderColor: "#171717",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#d4d4d4", boxWidth: 12, padding: 20 },
      },
    },
  };

  return (
    <Card title="Protocol Usage">
      <div className="h-48 md:h-64 flex items-center justify-center">
        {loading && <div className="text-neutral-400">Loading Chart...</div>}
        {!loading && summary && <Doughnut data={chartData} options={options} />}
      </div>
    </Card>
  );
};

export default ProtocolChart;

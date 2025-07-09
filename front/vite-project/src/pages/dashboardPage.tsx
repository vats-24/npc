import KpiGrid from "../components/dashboard/kpiGrid";
import ProtocolChart from "../components/dashboard/protcolChart";
import TradesTable from "../components/dashboard/tradeTable";
import ActiveWalletsChart from "../components/dashboard/activeWallet";
import HistoricalSearch from "../components/dashboard/historicalSearch";
import TopHoldersTable from "../components/dashboard/topHolder";
import FartLogo from "../assets/fart.jpg";

const DashboardPage = () => {
  return (
    <div className="bg-neutral-900 text-neutral-100 min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-7xl space-y-6">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 tracking-wider">
            TokenWise
          </h1>
          <p className="text-neutral-400 mt-2 font-mono text-sm">
            Real-Time Intelligence for: Fart
            COin(9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump)
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KpiGrid />
          <ProtocolChart />
          <img src={FartLogo} className="rounded-md"></img>
          <ActiveWalletsChart />
        </main>
        <section className="space-y-6">
          <HistoricalSearch />
          <TradesTable />
          <TopHoldersTable />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;

import { SalesAreaChart } from "./charts";

export function SalesOverview({ chartData }: { chartData: { name: string; total: number }[] }) {
  return (
    <div className="lg:col-span-2 bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-6 pb-15">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Sales Overview</h3>
          <p className="text-sm text-gray-400 mt-1">Revenue performance for {new Date().getFullYear()}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#00ff7f] text-black rounded-lg text-sm font-medium">Monthly</button>
        </div>
      </div>
      <SalesAreaChart data={chartData} />
    </div>
  );
}

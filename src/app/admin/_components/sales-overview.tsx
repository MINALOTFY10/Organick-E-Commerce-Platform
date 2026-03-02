import { SalesAreaChart } from "./charts";

export function SalesOverview({ chartData }: { chartData: { name: string; total: number }[] }) {
  return (
    <div className="lg:col-span-2 bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-4 md:p-6 pb-15">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white">Sales Overview</h3>
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

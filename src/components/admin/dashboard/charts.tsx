"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type SalesPoint = { name: string; total: number };
type CategorySlice = { name: string; value: number; color: string };

export function SalesAreaChart({ data }: { data: SalesPoint[] }) {
  return (
    <div className="h-64 w-full">
      <div style={{ width: "100%", height: 300 }}>
        {" "}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff7f" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ff7f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a4d42" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 100).toFixed(0)}`} />
            <Tooltip contentStyle={{ backgroundColor: "#1a3d32", border: "1px solid #2a4d42", borderRadius: "8px" }} itemStyle={{ color: "#fff" }} />
            <Area type="monotone" dataKey="total" stroke="#00ff7f" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryPieChart({ data }: { data: CategorySlice[] }) {
  return (
    <div className="h-48 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-sm text-gray-400 mb-1">Categories</p>
        <p className="text-xl font-bold text-white">{data.length}</p>
      </div>
    </div>
  );
}

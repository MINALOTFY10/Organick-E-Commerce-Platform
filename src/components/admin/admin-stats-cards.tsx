import { Package } from "lucide-react";

export function AdminStatCard({
  title,
  value,
  Icon = Package,
  iconBg = "bg-[#00ff7f]/20",
  iconColor = "text-[#00ff7f]",
}: {
  title: string;
  value: string | number;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="bg-[#1a3d32] p-6 rounded-xl border border-[#2a4d42]">
      <div className="flex items-center gap-3">
        <div className={`p-3 ${iconBg} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}


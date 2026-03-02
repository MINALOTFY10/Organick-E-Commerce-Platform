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
    <div className="bg-[#1a3d32] p-4 md:p-6 rounded-xl border border-[#2a4d42]">
      <div className="flex items-center gap-3">
        <div className={`p-2 md:p-3 ${iconBg} rounded-lg shrink-0`}>
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-400">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}


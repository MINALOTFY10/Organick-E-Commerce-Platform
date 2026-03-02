import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  cards: {
    label: string;
    value: string | number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    trend?: string;
  }[];
}

export function StatsCard({ cards }: StatsCardProps) {
  return (
    <>
      {cards.map((card, index) =>
        card.trend ?
          <div key={index} className="bg-[#1a3d32] rounded-2xl p-6 border border-[#2a4d42] hover:border-[#00ff7f]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-linear-to-br ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-[#00ff7f] text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                {card.trend}
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">{card.label}</p>
            <h3 className="text-3xl font-bold text-white">{card.value}</h3>
          </div>
        : <div key={index} className="bg-[#1a3d32] rounded-2xl px-6 py-6 border border-[#2a4d42] hover:border-[#00ff7f]/30 transition-all">
            <div className="flex items-center justify-start gap-4">
              <div className={`p-3 rounded-xl bg-linear-to-br ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">{card.label}</p>
                <h3 className="text-3xl font-bold text-white">{card.value}</h3>
              </div>
            </div>
          </div>,
      )}
    </>
  );
}

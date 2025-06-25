import React from "react";
import KPICard from "../KPICard";

interface KPIData {
  title: string;
  value: string;
  change: number;
  status: "warning" | "normal" | "danger";
  icon: React.ReactNode;
}

interface CompareChannel {
  name: string;
  kpis: {
    title: string;
    value: any;
    change: number;
    status: "normal";
  }[];
}

interface DashboardKPIsProps {
  kpis: KPIData[];
  compareChannels?: CompareChannel[];
}

const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ kpis, compareChannels }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="min-w-[200px] flex-shrink-0">
            <KPICard
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              status={kpi.status}
              icon={kpi.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardKPIs; 
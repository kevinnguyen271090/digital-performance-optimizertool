import React from 'react';
import { Eye, TrendingUp, DollarSign, Users, Target, Percent, ShoppingCart } from 'lucide-react';
import KPICard from '../KPICard';

interface ChannelDetailMetricsProps {
  overview: {
    impressions: number;
    impressionsChange: number;
    clicks: number;
    clicksChange: number;
    ctr: number;
    ctrChange: number;
    spend: number;
    spendChange: number;
    conversions: number;
    conversionsChange: number;
    cpa: number;
    cpaChange: number;
    revenue: number;
    revenueChange: number;
    roas: number;
    roasChange: number;
  };
}

const ChannelDetailMetrics: React.FC<ChannelDetailMetricsProps> = ({ overview }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const getKPICardStatus = (change: number, isPositive: boolean = true): 'normal' | 'warning' | 'danger' => {
    if (isPositive) {
      return change >= 0 ? 'normal' : 'warning';
    } else {
      return change <= 0 ? 'normal' : 'warning';
    }
  };

  const kpis = [
    {
      title: 'Impressions',
      value: formatNumber(overview.impressions),
      change: overview.impressionsChange,
      status: getKPICardStatus(overview.impressionsChange),
      icon: <Eye className="w-5 h-5" />
    },
    {
      title: 'Clicks',
      value: formatNumber(overview.clicks),
      change: overview.clicksChange,
      status: getKPICardStatus(overview.clicksChange),
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: 'CTR',
      value: `${overview.ctr.toFixed(2)}%`,
      change: overview.ctrChange,
      status: getKPICardStatus(overview.ctrChange),
      icon: <Percent className="w-5 h-5" />
    },
    {
      title: 'Spend',
      value: formatCurrency(overview.spend),
      change: overview.spendChange,
      status: getKPICardStatus(overview.spendChange, false),
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      title: 'Conversions',
      value: formatNumber(overview.conversions),
      change: overview.conversionsChange,
      status: getKPICardStatus(overview.conversionsChange),
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'CPA',
      value: formatCurrency(overview.cpa),
      change: overview.cpaChange,
      status: getKPICardStatus(overview.cpaChange, false),
      icon: <Target className="w-5 h-5" />
    },
    {
      title: 'Revenue',
      value: formatCurrency(overview.revenue),
      change: overview.revenueChange,
      status: getKPICardStatus(overview.revenueChange),
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      title: 'ROAS',
      value: `${overview.roas.toFixed(2)}x`,
      change: overview.roasChange,
      status: getKPICardStatus(overview.roasChange),
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            status={kpi.status}
            icon={kpi.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default ChannelDetailMetrics; 
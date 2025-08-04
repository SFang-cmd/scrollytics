'use client';

import { TrendingUp, TrendingDown, Users, UserPlus, Heart, MessageCircle } from 'lucide-react';
import { currentMetrics, getGrowthMetrics } from '@/lib/mockData';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  positive?: boolean;
}

function KPICard({ title, value, change, changeLabel, icon, positive = true }: KPICardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl font-semibold text-gray-900">{formatValue(value)}</dd>
            </dl>
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-4 flex items-center">
            <div className={`flex items-center text-sm ${
              positive ? 'text-green-600' : 'text-red-600'
            }`}>
              {positive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium">
                {positive ? '+' : ''}{change > 0 ? change.toFixed(1) : change.toFixed(1)}%
              </span>
            </div>
            <span className="ml-2 text-sm text-gray-500">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KPICards() {
  const growthMetrics = getGrowthMetrics();

  const kpis = [
    {
      title: 'Followers',
      value: currentMetrics.followers,
      change: growthMetrics.weeklyGrowth.percentage,
      changeLabel: 'from last week',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      positive: growthMetrics.weeklyGrowth.percentage > 0
    },
    {
      title: 'Following',
      value: currentMetrics.following,
      change: -0.2,
      changeLabel: 'from last week',
      icon: <UserPlus className="w-5 h-5 text-green-600" />,
      positive: false
    },
    {
      title: 'Total Likes',
      value: currentMetrics.totalLikes,
      change: 8.2,
      changeLabel: 'from last month',
      icon: <Heart className="w-5 h-5 text-red-500" />,
      positive: true
    },
    {
      title: 'Total Comments',
      value: currentMetrics.totalComments,
      change: 12.5,
      changeLabel: 'from last month',
      icon: <MessageCircle className="w-5 h-5 text-purple-600" />,
      positive: true
    },
    {
      title: 'Engagement Rate',
      value: `${currentMetrics.engagementRate}%`,
      change: 0.4,
      changeLabel: 'from last week',
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      positive: true
    },
    {
      title: 'Accounts Engaged',
      value: currentMetrics.accountsEngaged,
      change: 15.3,
      changeLabel: 'from last week',
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          changeLabel={kpi.changeLabel}
          icon={kpi.icon}
          positive={kpi.positive}
        />
      ))}
    </div>
  );
}
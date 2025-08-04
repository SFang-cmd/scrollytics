'use client';

import Layout from '@/components/Layout';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { format, parseISO } from 'date-fns';
import { followerHistory, getGrowthMetrics, currentMetrics } from '@/lib/mockData';
import { TrendingUp, Users, UserPlus } from 'lucide-react';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const date = parseISO(String(label || ''));
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 mb-2">
          {format(date, 'EEEE, MMM dd, yyyy')}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FollowersPage() {
  const growthMetrics = getGrowthMetrics();
  
  // Calculate growth data for bar chart
  const growthData = followerHistory.map((item, index) => {
    if (index === 0) return { ...item, growth: 0 };
    const previousDay = followerHistory[index - 1];
    return {
      ...item,
      growth: item.followerCount - previousDay.followerCount
    };
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Followers Analytics</h1>
          <p className="text-gray-600 mt-2">Detailed insights into your follower growth and trends</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Followers</p>
                <p className="text-2xl font-bold text-gray-900">{currentMetrics.followers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Weekly Growth</p>
                <p className="text-2xl font-bold text-gray-900">+{growthMetrics.weeklyGrowth.followers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">{growthMetrics.weeklyGrowth.percentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Following</p>
                <p className="text-2xl font-bold text-gray-900">{currentMetrics.following.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Large Follower Growth Chart */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Follower Growth Trend</h2>
            <p className="text-sm text-gray-500 mt-1">30-day follower and following progression</p>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={followerHistory}>
                <defs>
                  <linearGradient id="followersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="followingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `${(value / 1000).toFixed(1)}K`;
                    }
                    return value.toString();
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="followerCount"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#followersGradient)"
                  name="Followers"
                />
                <Area
                  type="monotone"
                  dataKey="followingCount"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#followingGradient)"
                  name="Following"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Growth Bar Chart */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Daily Follower Growth</h2>
            <p className="text-sm text-gray-500 mt-1">Net follower gains/losses per day</p>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData.slice(1)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const date = parseISO(String(label || ''));
                      const growth = payload[0].value as number;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="text-sm text-gray-600 mb-1">
                            {format(date, 'MMM dd, yyyy')}
                          </p>
                          <p className={`text-sm font-semibold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {growth >= 0 ? '+' : ''}{growth} followers
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="growth"
                  fill="#10b981"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
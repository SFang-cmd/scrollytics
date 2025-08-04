'use client';

import Layout from '@/components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { engagementHistory, recentPosts, currentMetrics } from '@/lib/mockData';
import { Target, Users, TrendingUp, Eye } from 'lucide-react';

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

export default function ReachPage() {
  // Calculate reach metrics
  const totalAccountsEngaged = engagementHistory.reduce((sum, day) => sum + day.accountsEngaged, 0);
  const avgDailyReach = Math.round(totalAccountsEngaged / engagementHistory.length);
  const maxDailyReach = Math.max(...engagementHistory.map(day => day.accountsEngaged));
  
  // Calculate reach rate (accounts engaged / followers)
  const reachTrend = engagementHistory.map(day => ({
    ...day,
    reachRate: ((day.accountsEngaged / currentMetrics.followers) * 100).toFixed(1)
  }));

  // Reach vs Engagement correlation
  const reachEngagementData = engagementHistory.map(day => ({
    ...day,
    totalEngagement: day.likes + day.comments,
    reachEfficiency: ((day.likes + day.comments) / day.accountsEngaged).toFixed(2)
  }));

  // Weekly reach comparison
  const weeklyReachData = engagementHistory.slice(-14).reduce((acc, day, index) => {
    const week = index < 7 ? 'Previous Week' : 'This Week';
    if (!acc[week]) acc[week] = { week, accountsEngaged: 0, totalEngagement: 0, days: 0 };
    acc[week].accountsEngaged += day.accountsEngaged;
    acc[week].totalEngagement += day.likes + day.comments;
    acc[week].days += 1;
    return acc;
  }, {} as Record<string, { week: string; accountsEngaged: number; totalEngagement: number; days: number }>);

  const weeklyComparison = Object.values(weeklyReachData).map((item) => ({
    ...item,
    avgReachPerDay: Math.round(item.accountsEngaged / item.days),
    avgEngagementPerDay: Math.round(item.totalEngagement / item.days),
    efficiency: (item.totalEngagement / item.accountsEngaged).toFixed(2)
  }));

  // Audience overlap analysis (simulated)
  const audienceOverlap = [
    { name: 'New Accounts', value: 65, fill: '#3b82f6' },
    { name: 'Returning Accounts', value: 35, fill: '#10b981' }
  ];

  // Content type reach performance
  const contentTypeReach = recentPosts.reduce((acc, post) => {
    if (!acc[post.type]) {
      acc[post.type] = { type: post.type, reach: 0, engagement: 0, posts: 0 };
    }
    // Estimate reach based on engagement
    const estimatedReach = Math.floor((post.likes + post.comments) * 1.5);
    acc[post.type].reach += estimatedReach;
    acc[post.type].engagement += post.likes + post.comments;
    acc[post.type].posts += 1;
    return acc;
  }, {} as Record<string, { type: string; reach: number; engagement: number; posts: number }>);

  const reachByContentType = Object.values(contentTypeReach).map((item) => ({
    name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    avgReach: Math.round(item.reach / item.posts),
    avgEngagement: Math.round(item.engagement / item.posts),
    efficiency: ((item.engagement / item.reach) * 100).toFixed(1)
  }));

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reach Analytics</h1>
          <p className="text-gray-600 mt-2">Understanding your content&apos;s reach and audience engagement patterns</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Accounts Engaged</p>
                <p className="text-2xl font-bold text-gray-900">{currentMetrics.accountsEngaged.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Daily Avg Reach</p>
                <p className="text-2xl font-bold text-gray-900">{avgDailyReach}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reach Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((avgDailyReach / currentMetrics.followers) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Peak Daily Reach</p>
                <p className="text-2xl font-bold text-gray-900">{maxDailyReach}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reach Trend Chart */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Daily Reach Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Accounts engaged with your content over time</p>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementHistory}>
                <defs>
                  <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="accountsEngaged"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#reachGradient)"
                  name="Accounts Engaged"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reach Rate and Efficiency */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Reach Rate Trend */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Reach Rate Trend</h2>
              <p className="text-sm text-gray-500 mt-1">Percentage of followers reached daily</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reachTrend}>
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
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const date = parseISO(String(label || ''));
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="text-sm text-gray-600 mb-1">
                              {format(date, 'MMM dd, yyyy')}
                            </p>
                            <p className="text-sm font-semibold text-indigo-600">
                              Reach Rate: {payload[0].value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reachRate"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Audience Composition */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Audience Composition</h2>
              <p className="text-sm text-gray-500 mt-1">New vs returning account engagement</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={audienceOverlap}>
                  <RadialBar
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="value"
                  />
                  <Legend iconSize={18} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="text-sm font-semibold text-gray-900">{data.name}</p>
                            <p className="text-sm text-gray-600">{data.value}% of reach</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              {audienceOverlap.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.fill }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reach vs Engagement Correlation */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Reach vs Engagement</h2>
            <p className="text-sm text-gray-500 mt-1">How well your reach converts to engagement</p>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reachEngagementData}>
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="reachGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
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
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="accountsEngaged"
                  stackId="1"
                  stroke="#06b6d4"
                  fill="url(#reachGradient2)"
                  name="Accounts Engaged"
                />
                <Area
                  type="monotone"
                  dataKey="totalEngagement"
                  stackId="2"
                  stroke="#ef4444"
                  fill="url(#engagementGradient)"
                  name="Total Engagement"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Type Performance and Weekly Comparison */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Content Type Reach */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Reach by Content Type</h2>
              <p className="text-sm text-gray-500 mt-1">Average reach performance by post type</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reachByContentType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="text-sm font-semibold text-gray-900">{label}</p>
                            <p className="text-sm text-gray-600">
                              Avg Reach: {data.avgReach.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Efficiency: {data.efficiency}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avgReach" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Comparison */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Weekly Reach Comparison</h2>
              <p className="text-sm text-gray-500 mt-1">Compare reach performance between weeks</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="text-sm font-semibold text-gray-900">{label}</p>
                            <p className="text-sm text-gray-600">
                              Total Reach: {data.accountsEngaged.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Daily Avg: {data.avgReachPerDay}
                            </p>
                            <p className="text-sm text-gray-600">
                              Efficiency: {data.efficiency}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="accountsEngaged" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
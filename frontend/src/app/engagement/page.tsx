'use client';

import Layout from '@/components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from 'recharts';
import { format, parseISO } from 'date-fns';
import { engagementHistory, recentPosts, currentMetrics } from '@/lib/mockData';
import { Heart, TrendingUp, BarChart3, Zap } from 'lucide-react';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const date = parseISO(label || '');
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

export default function EngagementPage() {
  // Calculate totals
  const totalLikes = engagementHistory.reduce((sum, day) => sum + day.likes, 0);
  const totalComments = engagementHistory.reduce((sum, day) => sum + day.comments, 0);
  const avgDailyLikes = Math.round(totalLikes / engagementHistory.length);
  const avgDailyComments = Math.round(totalComments / engagementHistory.length);

  // Calculate engagement rate trend
  const engagementTrend = engagementHistory.map(day => ({
    ...day,
    engagementRate: ((day.likes + day.comments) / currentMetrics.followers * 100).toFixed(2)
  }));

  // Get top performing posts
  const topPosts = [...recentPosts].sort((a, b) => b.engagementRate - a.engagementRate).slice(0, 5);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Engagement Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive view of likes, comments, and engagement trends</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{currentMetrics.totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Daily Likes</p>
                <p className="text-2xl font-bold text-gray-900">{avgDailyLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900">{currentMetrics.engagementRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Daily Comments</p>
                <p className="text-2xl font-bold text-gray-900">{avgDailyComments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Large Engagement Trend Chart */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Engagement Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Daily likes and comments over time</p>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={engagementHistory}>
                <defs>
                  <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="likes"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#likesGradient)"
                  name="Likes"
                />
                <Bar
                  yAxisId="right"
                  dataKey="comments"
                  fill="#8b5cf6"
                  name="Comments"
                  radius={[2, 2, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Rate Trend */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Daily Engagement Rate</h2>
            <p className="text-sm text-gray-500 mt-1">Engagement rate percentage by day</p>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend}>
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
                      const date = parseISO(label || '');
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="text-sm text-gray-600 mb-1">
                            {format(date, 'MMM dd, yyyy')}
                          </p>
                          <p className="text-sm font-semibold text-green-600">
                            Engagement Rate: {payload[0].value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagementRate"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Top Performing Posts</h2>
            <p className="text-sm text-gray-500 mt-1">Posts with highest engagement rates</p>
          </div>
          
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{post.type} Post</p>
                    <p className="text-sm text-gray-500">{format(parseISO(post.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">💬</span>
                    <span>{post.comments.toLocaleString()}</span>
                  </div>
                  <div className="font-semibold text-green-600">
                    {post.engagementRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
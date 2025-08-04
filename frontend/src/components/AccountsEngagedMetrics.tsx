'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { recentPosts } from '@/lib/mockData';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">
          Engagement Rate: {data.value}%
        </p>
        <p className="text-sm text-gray-600">
          Posts: {data.count}
        </p>
      </div>
    );
  }
  return null;
};

export default function AccountsEngagedMetrics() {
  // Group posts by type and calculate engagement rates
  const postsByType = recentPosts.reduce((acc, post) => {
    if (!acc[post.type]) {
      acc[post.type] = {
        count: 0,
        totalEngagement: 0,
        totalLikes: 0,
        totalComments: 0
      };
    }
    acc[post.type].count++;
    acc[post.type].totalEngagement += post.engagementRate;
    acc[post.type].totalLikes += post.likes;
    acc[post.type].totalComments += post.comments;
    return acc;
  }, {} as Record<string, any>);

  // Create pie chart data
  const pieData = Object.entries(postsByType).map(([type, data]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: Math.round((data.totalEngagement / data.count) * 100) / 100,
    count: data.count,
    totalLikes: data.totalLikes,
    totalComments: data.totalComments
  }));

  // Calculate total accounts engaged from recent posts
  const totalEngagedAccounts = recentPosts.reduce((sum, post) => {
    return sum + Math.floor((post.likes + post.comments) * 0.8); // Approximate unique accounts
  }, 0);

  const averageEngagementRate = recentPosts.reduce((sum, post) => sum + post.engagementRate, 0) / recentPosts.length;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Engagement by Content Type</h3>
          <p className="text-sm text-gray-500">Average engagement rate by post type</p>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accounts Engaged Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Accounts Engaged Summary</h3>
          <p className="text-sm text-gray-500">Overview of audience engagement metrics</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalEngagedAccounts.toLocaleString()}
            </div>
            <div className="text-sm text-blue-700 font-medium">Total Accounts Engaged</div>
            <div className="text-xs text-blue-600 mt-1">From recent posts</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {averageEngagementRate.toFixed(1)}%
            </div>
            <div className="text-sm text-green-700 font-medium">Average Engagement Rate</div>
            <div className="text-xs text-green-600 mt-1">Across all content types</div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Performance by Type</h4>
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {item.value}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
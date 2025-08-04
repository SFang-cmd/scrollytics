'use client';

import Layout from '@/components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { engagementHistory, recentPosts, currentMetrics } from '@/lib/mockData';
import { MessageCircle, TrendingUp, Users, BarChart3 } from 'lucide-react';

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

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function CommentsPage() {
  // Calculate comment metrics
  const totalComments = engagementHistory.reduce((sum, day) => sum + day.comments, 0);
  const avgDailyComments = Math.round(totalComments / engagementHistory.length);
  const maxComments = Math.max(...engagementHistory.map(day => day.comments));
  
  // Calculate comment-to-like ratio
  const commentToLikeRatio = engagementHistory.map(day => ({
    ...day,
    ratio: ((day.comments / day.likes) * 100).toFixed(1)
  }));

  // Comment distribution by post type
  const commentsByType = recentPosts.reduce((acc, post) => {
    if (!acc[post.type]) {
      acc[post.type] = { type: post.type, comments: 0, posts: 0 };
    }
    acc[post.type].comments += post.comments;
    acc[post.type].posts += 1;
    return acc;
  }, {} as Record<string, { type: string; comments: number; posts: number }>);

  const commentDistribution = Object.values(commentsByType).map((item) => ({
    name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    value: item.comments,
    avgPerPost: Math.round(item.comments / item.posts)
  }));

  // Top commented posts
  const topCommentedPosts = [...recentPosts].sort((a, b) => b.comments - a.comments).slice(0, 5);

  // Weekly comment comparison
  const weeklyData = engagementHistory.slice(-14).reduce((acc, day, index) => {
    const week = index < 7 ? 'Previous Week' : 'This Week';
    if (!acc[week]) acc[week] = { week, comments: 0, days: 0 };
    acc[week].comments += day.comments;
    acc[week].days += 1;
    return acc;
  }, {} as Record<string, { week: string; comments: number; days: number }>);

  const weeklyComparison = Object.values(weeklyData).map((item) => ({
    ...item,
    avgPerDay: Math.round(item.comments / item.days)
  }));

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comments Analytics</h1>
          <p className="text-gray-600 mt-2">Deep dive into comment engagement and conversation patterns</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">{currentMetrics.totalComments.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Daily Average</p>
                <p className="text-2xl font-bold text-gray-900">{avgDailyComments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Peak Day</p>
                <p className="text-2xl font-bold text-gray-900">{maxComments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Comment Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(avgDailyComments / currentMetrics.followers * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Trend Chart */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Comments Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Daily comment volume over time</p>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementHistory}>
                <defs>
                  <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
                  dataKey="comments"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#commentsGradient)"
                  name="Comments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comment to Like Ratio and Distribution */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Comment to Like Ratio */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Comment to Like Ratio</h2>
              <p className="text-sm text-gray-500 mt-1">Percentage of comments relative to likes</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commentToLikeRatio}>
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
                            <p className="text-sm font-semibold text-purple-600">
                              Ratio: {payload[0].value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ratio"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comments by Content Type */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Comments by Content Type</h2>
              <p className="text-sm text-gray-500 mt-1">Distribution of comments across post types</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={commentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {commentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              {commentDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.avgPerPost} avg/post</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Commented Posts */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Most Commented Posts</h2>
            <p className="text-sm text-gray-500 mt-1">Posts generating the most conversation</p>
          </div>
          
          <div className="space-y-4">
            {topCommentedPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{post.type} Post</p>
                    <p className="text-sm text-gray-500">{format(parseISO(post.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold">{post.comments}</span>
                    <span className="text-gray-500">comments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-red-500">❤️</span>
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="font-semibold text-green-600">
                    {post.engagementRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Weekly Comment Comparison</h2>
            <p className="text-sm text-gray-500 mt-1">Compare comment volume between weeks</p>
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
                            Total: {data.comments} comments
                          </p>
                          <p className="text-sm text-gray-600">
                            Daily Avg: {data.avgPerDay} comments
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="comments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
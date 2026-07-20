import React, { useState } from 'react';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserPlusIcon,
  PlusIcon,
  DocumentPlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('weekly');

  // Mock Data - API se replace hoga
  const stats = {
    totalStudents: 1250,
    totalTeachers: 48,
    totalQuestions: 3420,
    totalRevenue: 45680,
    activeUsers: 892,
    studentGrowth: 12.5,
    teacherGrowth: 8.3,
    questionGrowth: 15.2,
    revenueGrowth: 8.2
  };

  // Revenue Chart Data
  const revenueData = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 28000 },
    { month: 'Mar', revenue: 35000 },
    { month: 'Apr', revenue: 42000 },
    { month: 'May', revenue: 38000 },
    { month: 'Jun', revenue: 45000 },
    { month: 'Jul', revenue: 48000 },
    { month: 'Aug', revenue: 52000 },
    { month: 'Sep', revenue: 49000 },
    { month: 'Oct', revenue: 55000 },
    { month: 'Nov', revenue: 58000 },
    { month: 'Dec', revenue: 60000 },
  ];

  // Top Teachers Data
  const topTeachers = [
    { name: 'Dr. Rahul Sharma', questions: 120, students: 45, subject: 'Mathematics' },
    { name: 'Prof. Priya Patel', questions: 98, students: 38, subject: 'Physics' },
    { name: 'Mr. Amit Kumar', questions: 85, students: 32, subject: 'Chemistry' },
    { name: 'Ms. Sneha Reddy', questions: 72, students: 28, subject: 'Biology' },
  ];

  // Recent Activities
  const recentActivities = [
    { id: 1, type: 'student', user: 'Raj Kumar', action: 'enrolled in Class 10 Mathematics', time: '2 min ago', icon: '🎓' },
    { id: 2, type: 'question', user: 'Teacher Ananya', action: 'added 15 new Science questions', time: '15 min ago', icon: '📝' },
    { id: 3, type: 'quiz', user: 'Priya Singh', action: 'scored 85% in Physics quiz', time: '1 hour ago', icon: '🎯' },
    { id: 4, type: 'agent', user: 'Agent Suresh', action: 'referred 3 new students from Mumbai', time: '2 hours ago', icon: '👤' },
    { id: 5, type: 'teacher', user: 'Dr. Rahul', action: 'uploaded new course: Advanced Mathematics', time: '3 hours ago', icon: '📚' },
    { id: 6, type: 'student', user: 'Amit Verma', action: 'completed Class 9 Science course', time: '5 hours ago', icon: '✅' },
  ];

  // Colors for charts
  const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Page Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your platform overview.</p>
        </div>
        <div className="flex flex-wrap gap-3">

          <button className="btn-secondary flex items-center gap-2 text-sm">
            <ChartBarIcon className="w-4 h-4" />
            Reports
          </button>
        </div>
      </div>

      {/* Stats Cards - 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Students</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="bg-blue-500 p-2.5 rounded-lg">
              <UsersIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-600 flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              {stats.studentGrowth}%
            </span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalTeachers}</p>
            </div>
            <div className="bg-green-500 p-2.5 rounded-lg">
              <AcademicCapIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-600 flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              {stats.teacherGrowth}%
            </span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Total Questions */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Questions</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalQuestions.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 p-2.5 rounded-lg">
              <QuestionMarkCircleIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-600 flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              {stats.questionGrowth}%
            </span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-500 p-2.5 rounded-lg">
              <CurrencyDollarIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-600 flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              {stats.revenueGrowth}%
            </span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.activeUsers}</p>
            </div>
            <div className="bg-indigo-500 p-2.5 rounded-lg">
              <UserGroupIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-600 flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              12.3%
            </span>
            <span className="text-gray-400">today</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setTimeRange('weekly')}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  timeRange === 'weekly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  timeRange === 'monthly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setTimeRange('yearly')}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  timeRange === 'yearly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Teachers */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">🏆 Top Teachers</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All →</button>
          </div>
          <div className="space-y-3">
            {topTeachers.map((teacher, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{teacher.name}</p>
                    <p className="text-xs text-gray-500">{teacher.subject} • {teacher.students} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{teacher.questions}</p>
                  <p className="text-xs text-gray-400">questions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">🔄 Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All →</button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0">
                <div className="text-xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-xl font-bold text-gray-800">156</p>
              </div>
              <div className="bg-blue-500 p-2 rounded-lg">
                <span className="text-white text-sm">📚</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
                <p className="text-xl font-bold text-gray-800">2,847</p>
              </div>
              <div className="bg-green-500 p-2 rounded-lg">
                <span className="text-white text-sm">🎯</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-xl font-bold text-gray-800">24</p>
              </div>
              <div className="bg-purple-500 p-2 rounded-lg">
                <span className="text-white text-sm">👤</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-xl font-bold text-gray-800">8</p>
              </div>
              <div className="bg-yellow-500 p-2 rounded-lg">
                <span className="text-white text-sm">⏳</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
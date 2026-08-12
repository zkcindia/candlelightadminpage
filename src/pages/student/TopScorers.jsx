// src/components/TopScorers.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  TrophyIcon,
  ClockIcon,
  ArrowPathIcon,
  BoltIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getTopStudents } from "../../service/api";

export default function TopScorers() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("month");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch top students from API
  useEffect(() => {
    fetchTopStudents();
  }, []);

  const fetchTopStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getTopStudents();
      
      if (response.status && response.data) {
        // Transform API data to match component format
        const formattedData = response.data.map((item, index) => ({
          id: item.student_id || item.id || index,
          name: item.student_name || item.name || 'Unknown',
          score: item.score || 0,
          subject: item.subject || 'Not specified',
          email: item.email || '',
          date: item.date || '',
          rank: item.rank || index + 1,
          class: item.class || '10th',
          image: item.image || null
        }));
        setStudents(formattedData);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching top students:', err);
      setError(err.message || 'Failed to load top students');
      // Fallback to sample data
      setStudents(getSampleData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTopStudents();
  };

  // Sample data for fallback
  const getSampleData = () => {
    return [
      { id: 1, name: 'Biswajit Pattanayak', score: 95, subject: 'HISTORY', class: '12th', rank: 1 },
      { id: 2, name: 'Rahul Sharma', score: 88, subject: 'MATHEMATICS', class: '12th', rank: 2 },
      { id: 3, name: 'Priya Patel', score: 82, subject: 'SCIENCE', class: '11th', rank: 3 },
      { id: 4, name: 'Amit Kumar', score: 78, subject: 'ENGLISH', class: '12th', rank: 4 },
      { id: 5, name: 'Sneha Reddy', score: 75, subject: 'HISTORY', class: '10th', rank: 5 },
      { id: 6, name: 'Vikram Singh', score: 72, subject: 'MATHEMATICS', class: '11th', rank: 6 },
      { id: 7, name: 'Neha Gupta', score: 68, subject: 'SCIENCE', class: '12th', rank: 7 },
      { id: 8, name: 'Deepak Joshi', score: 65, subject: 'ENGLISH', class: '10th', rank: 8 },
      { id: 9, name: 'Kavya Nair', score: 62, subject: 'HISTORY', class: '11th', rank: 9 },
      { id: 10, name: 'Arjun Mehta', score: 58, subject: 'MATHEMATICS', class: '12th', rank: 10 },
    ];
  };

  const topScorers = useMemo(() => {
    return [...students]
      .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
      .slice(0, 10);
  }, [students]);

  // Monthly Data (can be from API or static)
  const monthlyData = [
    { month: "Jan", score: 65 },
    { month: "Feb", score: 72 },
    { month: "Mar", score: 78 },
    { month: "Apr", score: 82 },
    { month: "May", score: 88 },
    { month: "Jun", score: 92 },
    { month: "Jul", score: 95 },
  ];

  // Yearly Data
  const yearlyData = [
    { month: "2020", score: 70 },
    { month: "2021", score: 78 },
    { month: "2022", score: 85 },
    { month: "2023", score: 92 },
    { month: "2024", score: 98 },
  ];

  const chartData = activeTab === "month" ? monthlyData : yearlyData;
  const barColors = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 18 },
    },
  };

  const getStatus = (index) => {
    if (index < 2) return { text: "Online", color: "text-green-600" };
    if (index === 2) return { text: "5 min ago", color: "text-gray-500" };
    return { text: `${index * 3} min ago`, color: "text-gray-400" };
  };

  const getMultiplier = (index) => {
    if (index === 0) return "x3";
    if (index === 1) return "x2";
    if (index === 2) return "x2";
    return null;
  };

  const getRankStyle = (index) => {
    if (index === 0)
      return {
        label: "1",
        wrapper: "from-yellow-300 to-orange-300 text-orange-700",
      };
    if (index === 1)
      return {
        label: "2",
        wrapper: "from-slate-200 to-slate-300 text-slate-700",
      };
    if (index === 2)
      return {
        label: "3",
        wrapper: "from-orange-300 to-amber-400 text-orange-800",
      };
    return {
      label: index + 1,
      wrapper: "from-blue-100 to-blue-200 text-blue-700",
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white p-6 border-2 border-gray-200 shadow-sm">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-gray-700">Loading top students...</p>
        </div>
      </div>
    );
  }

  if (!topScorers.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-white p-6 border-2 border-gray-200 shadow-sm">
        <div className="text-center">
          <TrophyIcon className="mx-auto mb-2 h-10 w-10 text-gray-400" />
          <p className="text-sm font-semibold text-gray-700">
            No students in leaderboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md border border-gray-200">
      {/* Header */}
      <div className="relative mb-4 text-center">
        <motion.h2
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-2xl font-black text-blue-600"
        >
          🏆 Student Top Scorers
        </motion.h2>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>

      {/* Main Grid - 60% List + 40% Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Left: Leaderboard List (60%) */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white px-2.5 pb-3 pt-4 shadow-[0_4px_0_#93c5fd] h-full"
          >
            {/* Toolbar */}
            <div className="mb-2 flex items-center justify-between rounded-xl bg-blue-50/50 px-2.5 py-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-800">
                <ClockIcon className="h-3.5 w-3.5" />
                Top {topScorers.length} Scorers
              </div>
              <motion.button
                whileHover={{ rotate: 180, scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="rounded-full bg-white/70 p-1.5 text-blue-600 shadow-sm hover:bg-white disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>

            {/* List - 10 Students */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1"
            >
              {topScorers.map((student, index) => {
                const status = getStatus(index);
                const multiplier = getMultiplier(index);
                const rank = getRankStyle(index);

                return (
                  <React.Fragment key={student.id ?? `${student.name}-${index}`}>
                    {index === 5 && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0.7 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        className="my-1.5 flex items-center gap-2"
                      >
                        <div className="h-0.5 flex-1 rounded-full bg-blue-200" />
                        <span className="rounded-full bg-blue-500 px-3 py-0.5 text-[9px] font-bold text-white shadow">
                          ▲ More Students ▲
                        </span>
                        <div className="h-0.5 flex-1 rounded-full bg-blue-200" />
                      </motion.div>
                    )}

                    <motion.div
                      variants={rowVariants}
                      whileHover={{ scale: 1.01, x: 2 }}
                      className={`flex items-center gap-2 rounded-2xl border-2 px-2 py-1.5 shadow-[0_2px_0_#bfdbfe] transition-all ${
                        index < 3
                          ? "border-blue-300 bg-gradient-to-r from-blue-50 to-white"
                          : "border-blue-200 bg-white hover:bg-blue-50/50"
                      }`}
                    >
                      {/* Rank */}
                      <motion.div
                        animate={
                          index < 3 ? { rotate: [0, -5, 5, 0] } : {}
                        }
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold shadow-md ${rank.wrapper}`}
                      >
                        {rank.label}
                      </motion.div>

                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border-2 border-blue-400 bg-gradient-to-br from-blue-200 to-blue-400 text-sm font-bold text-blue-900 shadow">
                          {student.image ? (
                            <img src={student.image} alt={student.name} className="h-full w-full object-cover" />
                          ) : (
                            student.name?.charAt(0)?.toUpperCase() || "S"
                          )}
                        </div>
                        {index < 3 && (
                          <motion.span
                            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="absolute -right-1 -top-1.5 text-xs"
                          >
                            ✨
                          </motion.span>
                        )}
                      </div>

                      {/* Name & Details */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-gray-800">
                          {student.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-1.5">
                          <span className={`text-[10px] font-semibold ${status.color}`}>
                            {status.text}
                          </span>
                          <span className="text-[9px] font-medium text-gray-400">
                            {student.class || '10th'}
                          </span>
                          <span className="text-[8px] font-medium text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded">
                            {student.subject}
                          </span>
                        </div>
                      </div>

                      {/* Multiplier */}
                      {multiplier && (
                        <motion.div
                          animate={{ y: [0, -3, 0], rotate: [0, -4, 4, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.25 }}
                          className="relative hidden sm:block"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-300 bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_2px_0_#2563eb]">
                            <BoltIcon className="h-4 w-4 text-white" />
                          </div>
                          <span className="absolute -bottom-1 -right-1.5 rounded-full bg-yellow-100 px-1 text-[8px] font-bold text-blue-800 shadow">
                            {multiplier}
                          </span>
                        </motion.div>
                      )}

                      {/* Score */}
                      <div className="flex min-w-[60px] items-center justify-end gap-0.5 sm:min-w-[75px]">
                        <motion.span
                          animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.1, 1] }}
                          transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.12 }}
                          className="text-lg drop-shadow"
                        >
                          ✹
                        </motion.span>
                        <motion.span
                          key={student.score}
                          initial={{ scale: 1.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-sm font-bold text-blue-900 sm:text-base"
                        >
                          {student.score}
                        </motion.span>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Bar Chart Section (40%) */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white p-4 shadow-[0_4px_0_#93c5fd] h-full flex flex-col"
          >
            {/* Chart Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">Performance</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveTab("month")}
                  className={`px-3 py-1 text-[10px] font-medium rounded-lg transition-all ${
                    activeTab === "month"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setActiveTab("year")}
                  className={`px-3 py-1 text-[10px] font-medium rounded-lg transition-all ${
                    activeTab === "year"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  Year
                </button>
              </div>
            </div>

            {/* Stats - Chart ke Upar */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-blue-50 rounded-xl px-3 py-2.5 text-center border border-blue-100">
                <p className="text-lg font-bold text-blue-600">
                  {topScorers.length > 0 ? Math.round(topScorers.reduce((acc, s) => acc + s.score, 0) / topScorers.length) : 0}
                </p>
                <p className="text-[8px] text-gray-400 font-medium">Avg Score</p>
              </div>
              <div className="bg-green-50 rounded-xl px-3 py-2.5 text-center border border-green-100">
                <p className="text-lg font-bold text-green-600">
                  {topScorers.length > 0 ? topScorers[0]?.score || 0 : 0}
                </p>
                <p className="text-[8px] text-gray-400 font-medium">Top Score</p>
              </div>
              <div className="bg-purple-50 rounded-xl px-3 py-2.5 text-center border border-purple-100">
                <p className="text-lg font-bold text-purple-600">{topScorers.length}</p>
                <p className="text-[8px] text-gray-400 font-medium">Students</p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    width={25}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={barColors[index % barColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
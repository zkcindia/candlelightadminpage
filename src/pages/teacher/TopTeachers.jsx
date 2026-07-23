import React, { useMemo, useState } from "react";
import {
  TrophyIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  StarIcon,
  MapPinIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon,
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

export default function TopTeachers({ teachers = [] }) {
  const [activeTab, setActiveTab] = useState("month");

  const topTeachers = useMemo(() => {
    return [...teachers]
      .sort((a, b) => Number(b.uploads || 0) - Number(a.uploads || 0))
      .slice(0, 10);
  }, [teachers]);

  // Monthly Data
  const monthlyData = [
    { month: "Jan", uploads: 45 },
    { month: "Feb", uploads: 52 },
    { month: "Mar", uploads: 58 },
    { month: "Apr", uploads: 62 },
    { month: "May", uploads: 70 },
    { month: "Jun", uploads: 78 },
    { month: "Jul", uploads: 85 },
  ];

  // Yearly Data
  const yearlyData = [
    { month: "2020", uploads: 120 },
    { month: "2021", uploads: 180 },
    { month: "2022", uploads: 250 },
    { month: "2023", uploads: 320 },
    { month: "2024", uploads: 400 },
  ];

  const chartData = activeTab === "month" ? monthlyData : yearlyData;
  const barColors = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
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

  const getStatus = (index) => {
    if (index < 2) return { text: "Active", color: "text-green-600" };
    if (index === 2) return { text: "Recent", color: "text-blue-600" };
    return { text: "Active", color: "text-gray-500" };
  };

  if (!topTeachers.length) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
        <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No teachers in leaderboard</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
            <TrophyIcon className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">🏆 Top Teachers</h3>
            <p className="text-xs text-gray-500">Most question uploads</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <DocumentTextIcon className="w-3.5 h-3.5" />
            <span>{topTeachers.reduce((acc, t) => acc + t.uploads, 0)} total</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
            <p className="text-lg font-bold text-blue-600">{topTeachers.length}</p>
            <p className="text-[10px] text-gray-500">Top Teachers</p>
          </div>
          <div className="bg-green-50 rounded-lg px-3 py-2 text-center">
            <p className="text-lg font-bold text-green-600">
              {Math.round(
                topTeachers.reduce((acc, t) => acc + t.uploads, 0) /
                  topTeachers.length
              )}
            </p>
            <p className="text-[10px] text-gray-500">Avg Uploads</p>
          </div>
          <div className="bg-purple-50 rounded-lg px-3 py-2 text-center">
            <p className="text-lg font-bold text-purple-600">
              ₹{topTeachers.reduce((acc, t) => acc + t.earnings, 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Main Grid - 60% List + 40% Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 p-4">
        {/* Left: Leaderboard List (60%) */}
        <div className="lg:col-span-6">
          <div className="rounded-xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-3">
            {/* Toolbar */}
            <div className="mb-2 flex items-center justify-between rounded-lg bg-blue-50/50 px-2.5 py-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-800">
                <ClockIcon className="h-3.5 w-3.5" />
                Top 10 Teachers
              </div>
              <motion.button
                whileHover={{ rotate: 180, scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full bg-white/70 p-1.5 text-blue-600 shadow-sm hover:bg-white"
              >
                <ArrowPathIcon className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            {/* List - 10 Teachers */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1"
            >
              {topTeachers.map((teacher, index) => {
                const rank = getRankStyle(index);
                const status = getStatus(index);

                return (
                  <React.Fragment key={teacher.id ?? `${teacher.name}-${index}`}>
                    {index === 5 && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0.7 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        className="my-1.5 flex items-center gap-2"
                      >
                        <div className="h-0.5 flex-1 rounded-full bg-blue-200" />
                        <span className="rounded-full bg-blue-500 px-3 py-0.5 text-[9px] font-bold text-white shadow">
                          ▲ More Teachers ▲
                        </span>
                        <div className="h-0.5 flex-1 rounded-full bg-blue-200" />
                      </motion.div>
                    )}

                    <motion.div
                      variants={rowVariants}
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-all ${
                        index < 3
                          ? "border-yellow-200 bg-gradient-to-r from-yellow-50/80 to-transparent"
                          : "border-blue-100 bg-white hover:bg-blue-50/50"
                      }`}
                    >
                      {/* Rank */}
                      <motion.div
                        animate={
                          index < 3 ? { rotate: [0, -5, 5, 0] } : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold shadow-md ${rank.wrapper}`}
                      >
                        {rank.label}
                      </motion.div>

                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border-2 border-blue-400 bg-gradient-to-br from-blue-200 to-blue-400 text-sm font-bold text-blue-900 shadow">
                          {teacher.name?.charAt(0)?.toUpperCase() || "T"}
                        </div>
                        {index < 3 && (
                          <motion.span
                            animate={{
                              scale: [1, 1.3, 1],
                              rotate: [0, 15, 0],
                            }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="absolute -right-1 -top-1.5 text-xs"
                          >
                            ✨
                          </motion.span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-bold text-gray-800">
                          {teacher.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-1.5">
                          <span
                            className={`text-[10px] font-semibold ${status.color}`}
                          >
                            ● {status.text}
                          </span>
                          <span className="text-[9px] font-medium text-gray-400 flex items-center gap-0.5">
                            <AcademicCapIcon className="w-3 h-3" />
                            {teacher.subject}
                          </span>
                          <span className="text-[9px] font-medium text-gray-400 flex items-center gap-0.5">
                            <MapPinIcon className="w-3 h-3" />
                            {teacher.district}
                          </span>
                        </div>
                      </div>

                      {/* Uploads */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">
                            {teacher.uploads}
                          </p>
                          <p className="text-[9px] text-gray-400 -mt-0.5">
                            uploads
                          </p>
                        </div>
                      </div>

                      {/* Earnings */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right min-w-[65px]">
                          <p className="text-sm font-bold text-green-600">
                            ₹{teacher.earnings.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-gray-400 -mt-0.5">
                            earned
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Right: Bar Chart Section (40%) */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white p-4 shadow-[0_4px_0_#93c5fd] h-full flex flex-col">
            {/* Chart Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">Uploads</span>
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-blue-50 rounded-xl px-3 py-2.5 text-center border border-blue-100">
                <p className="text-lg font-bold text-blue-600">
                  {Math.round(
                    topTeachers.reduce((acc, t) => acc + t.uploads, 0) /
                      topTeachers.length
                  )}
                </p>
                <p className="text-[8px] text-gray-400 font-medium">
                  Avg Uploads
                </p>
              </div>
              <div className="bg-green-50 rounded-xl px-3 py-2.5 text-center border border-green-100">
                <p className="text-lg font-bold text-green-600">↑22%</p>
                <p className="text-[8px] text-gray-400 font-medium">Growth</p>
              </div>
              <div className="bg-purple-50 rounded-xl px-3 py-2.5 text-center border border-purple-100">
                <p className="text-lg font-bold text-purple-600">10</p>
                <p className="text-[8px] text-gray-400 font-medium">Top</p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 10,
                      fill: "#6b7280",
                      fontWeight: 500,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
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
                    dataKey="uploads"
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-gray-500">
            Top performers this month
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400">🏆</span>
          <span className="text-[10px] font-medium text-gray-600">
            {topTeachers[0]?.name} leads
          </span>
        </div>
      </div>
    </div>
  );
}
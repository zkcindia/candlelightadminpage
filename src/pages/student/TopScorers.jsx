import React, { useMemo } from "react";
import {
  TrophyIcon,
  ClockIcon,
  ArrowPathIcon,
  BoltIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function TopScorers({ students = [] }) {
  const topScorers = useMemo(() => {
    return [...students]
      .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
      .slice(0, 10);
  }, [students]);

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

  const getStatus = (index) => {
    if (index < 2) return { text: "Playing now", color: "text-green-600" };
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
      wrapper: "from-pink-100 to-pink-200 text-pink-700",
    };
  };

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
          🍦 Student Top Scorers
        </motion.h2>
        <p className="text-xs font-semibold text-gray-500">
          Top Scorers Leaderboard
        </p>
      </div>

      {/* Qualifier Ribbon */}
      {/* <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mx-auto -mb-3 flex w-[92%] items-center justify-center rounded-t-xl border-b-2 border-blue-700 bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 shadow-[0_4px_0_#1a56db]"
      >
        <SparklesIcon className="mr-1.5 h-4 w-4 text-white" />
        <span
          className="text-sm font-bold text-white"
          style={{ textShadow: "0 2px 0 #1e3a8a" }}
        >
          Qualifier
        </span>
        <span className="ml-2 text-xs font-bold text-white/90">⏳ 02d 19h</span>
      </motion.div> */}

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white px-2.5 pb-3 pt-4 shadow-[0_4px_0_#93c5fd]"
      >
 

        {/* Toolbar */}
        <div className="mb-2 flex items-center justify-between rounded-xl bg-blue-50/50 px-2.5 py-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-800">
            <ClockIcon className="h-3.5 w-3.5" />
            Top Three Scorers
          </div>
          <motion.button
            whileHover={{ rotate: 180, scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full bg-white/70 p-1.5 text-blue-600 shadow-sm hover:bg-white"
          >
            <ArrowPathIcon className="h-3.5 w-3.5" />
          </motion.button>
        </div>

        {/* List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1.5"
        >
          {topScorers.map((student, index) => {
            const status = getStatus(index);
            const multiplier = getMultiplier(index);
            const rank = getRankStyle(index);

            return (
              <React.Fragment key={student.id ?? `${student.name}-${index}`}>
                {index === 3 && (
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

                  {/* Name */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-gray-800">
                      {student.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-1.5">
                      <span className={`text-[10px] font-semibold ${status.color}`}>
                        {status.text}
                      </span>
                      <span className="text-[9px] font-medium text-gray-400">
                        {student.class}
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
  );
}
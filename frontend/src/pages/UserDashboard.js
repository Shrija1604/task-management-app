import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle2, Clock, CalendarDays, AlertTriangle, PlayCircle, Loader2 } from "lucide-react";
import API from "../services/api";

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/tasks/stats");
        setStats(data);
        if (data.overdue > 0) {
          import("react-hot-toast").then(({ toast }) => {
            toast(`You have ${data.overdue} overdue task${data.overdue > 1 ? 's' : ''}!`, {
              icon: '⚠️',
              duration: 5000,
            });
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center dark:bg-slate-900">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Tasks", value: stats?.total ?? 0, icon: <CheckCircle2 />, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
    { title: "Completed", value: stats?.completed ?? 0, icon: <CheckCircle2 />, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
    { title: "Pending", value: stats?.pending ?? 0, icon: <Clock />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { title: "In Progress", value: stats?.inProgress ?? 0, icon: <PlayCircle />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { title: "Overdue", value: stats?.overdue ?? 0, icon: <AlertTriangle />, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
  ];

  const pieData = [
    { name: "Completed", value: stats?.completed ?? 0, color: "#10b981" },
    { name: "In Progress", value: stats?.inProgress ?? 0, color: "#3b82f6" },
    { name: "Pending", value: stats?.pending ?? 0, color: "#f59e0b" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900 dark:text-slate-100 md:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user.name?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Here's your productivity overview for today.
          </p>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <div className="text-right">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm font-medium uppercase text-indigo-500">{user.role}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50"
          >
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{card.value}</h3>
            </div>
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Weekly Productivity */}
        <div className="col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
          <h2 className="mb-6 text-lg font-bold">Weekly Productivity</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.weeklyData || []}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
          <h2 className="mb-6 text-lg font-bold">Status Distribution</h2>
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Upcoming Deadlines (7 days)</h2>
          <Link to="/tasks" className="text-sm font-semibold text-indigo-500 hover:text-indigo-600">
            View All Tasks &rarr;
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {!stats?.upcoming || stats.upcoming.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <CalendarDays className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="font-medium text-slate-600 dark:text-slate-400">No upcoming deadlines! 🎉</p>
            </div>
          ) : (
            stats.upcoming.map((task) => (
              <div
                key={task._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700/50 dark:bg-slate-800/80"
              >
                <div>
                  <h3 className="mb-1 truncate font-semibold text-slate-900 dark:text-white">{task.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4" />
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    task.priority === 'Urgent' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                    task.priority === 'High' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' :
                    task.priority === 'Medium' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                    'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

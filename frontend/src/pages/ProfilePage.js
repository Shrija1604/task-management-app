import React, { useState, useEffect, useRef } from "react";
import { updateProfile, deleteAccount } from "../services/authService";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Camera, LogOut, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    confirmPassword: "",
    profileImage: user.profileImage || "",
  });
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await API.get("/tasks");
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks for heatmap", error);
      }
    };
    fetchTasks();
  }, []);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      profileImage: formData.profileImage,
    };
    if (formData.password) payload.password = formData.password;

    try {
      setLoading(true);
      const data = await updateProfile(payload);
      const updatedUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        profileImage: data.profileImage,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", data.token);
      setUser(updatedUser);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      try {
        setLoading(true);
        await deleteAccount();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete account.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Prepare heatmap data
  const getHeatmapData = () => {
    const counts = {};
    tasks.forEach(task => {
      if (task.status === "Done" && task.updatedAt) {
        const dateStr = task.updatedAt.split("T")[0];
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      }
    });
    return Object.keys(counts).map(date => ({
      date,
      count: counts[date]
    }));
  };

  const shiftDate = (date, numDays) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  };
  const today = new Date();

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage your account settings and view your productivity streak.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column - Form */}
          <div className="md:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
              <div className="mb-8 flex items-center gap-6">
                <div className="relative">
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage} 
                      alt="Profile" 
                      className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-indigo-500/20" 
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-lg ring-4 ring-indigo-50 dark:ring-indigo-500/20">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md transition-transform hover:scale-110"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-indigo-500" />
                    <span className="uppercase text-indigo-500">{user.role} Account</span>
                  </div>
                </div>
              </div>

              <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={changeHandler}
                      required
                      className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={changeHandler}
                      required
                      className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700/50 dark:bg-slate-800/80">
                  <h3 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-300">Change Password</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={changeHandler}
                        placeholder="New Password"
                        className="w-full rounded-xl border-slate-200 bg-white p-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={changeHandler}
                        placeholder="Confirm Password"
                        className="w-full rounded-xl border-slate-200 bg-white p-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 p-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : <><CheckCircle2 className="h-5 w-5" /> Save Changes</>}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Heatmap & Actions */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
              <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Productivity Heatmap</h3>
              <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Your task completion history over the last 6 months.</p>
              
              <div className="heatmap-container -ml-4">
                <style>
                  {`
                    .react-calendar-heatmap .color-empty { fill: #f1f5f9; }
                    .react-calendar-heatmap .color-scale-1 { fill: #c7d2fe; }
                    .react-calendar-heatmap .color-scale-2 { fill: #818cf8; }
                    .react-calendar-heatmap .color-scale-3 { fill: #4f46e5; }
                    .react-calendar-heatmap .color-scale-4 { fill: #312e81; }
                    
                    .dark .react-calendar-heatmap .color-empty { fill: #334155; }
                    .dark .react-calendar-heatmap .color-scale-1 { fill: #4f46e5; opacity: 0.4; }
                    .dark .react-calendar-heatmap .color-scale-2 { fill: #4f46e5; opacity: 0.6; }
                    .dark .react-calendar-heatmap .color-scale-3 { fill: #4f46e5; opacity: 0.8; }
                    .dark .react-calendar-heatmap .color-scale-4 { fill: #4f46e5; opacity: 1; }
                    
                    .react-calendar-heatmap text { font-size: 10px; fill: #64748b; }
                    .dark .react-calendar-heatmap text { fill: #94a3b8; }
                  `}
                </style>
                <CalendarHeatmap
                  startDate={shiftDate(today, -150)}
                  endDate={today}
                  values={getHeatmapData()}
                  classForValue={(value) => {
                    if (!value || value.count === 0) return 'color-empty';
                    if (value.count === 1) return 'color-scale-1';
                    if (value.count === 2) return 'color-scale-2';
                    if (value.count === 3) return 'color-scale-3';
                    return 'color-scale-4';
                  }}
                  titleForValue={(value) => {
                    if (!value || !value.date) return 'No tasks completed';
                    return `${value.count} tasks completed on ${value.date}`;
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={logoutHandler}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
              >
                <LogOut className="h-5 w-5" /> Logout Session
              </button>
              
              <button 
                onClick={handleDeleteAccount}
                className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium text-slate-500 transition-colors hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
              >
                <AlertTriangle className="h-4 w-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

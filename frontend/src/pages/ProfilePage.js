import React, { useState, useEffect, useRef } from "react";
import { updateProfile, deleteAccount } from "../services/authService";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {
  Camera, LogOut, CheckCircle2, AlertTriangle, ShieldCheck,
  User, Mail, Phone, MapPin, Calendar, ChevronDown,
  FileText, Lock, Globe, Home, Eye, EyeOff,
} from "lucide-react";
import { toast } from "react-hot-toast";

const TABS = ["Personal Info", "Contact & Address", "Security"];

const InputField = ({ label, icon: Icon, children, hint }) => (
  <div>
    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
      {Icon && <Icon className="h-3.5 w-3.5 text-indigo-500" />}
      {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // Basic
    name: user.name || "",
    email: user.email || "",
    profileImage: user.profileImage || "",
    // Personal
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
    gender: user.gender || "",
    bio: user.bio || "",
    // Contact & Address
    phone: user.phone || "",
    city: user.address?.city || "",
    state: user.address?.state || "",
    country: user.address?.country || "",
    pincode: user.address?.pincode || "",
    // Security
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await API.get("/tasks");
        setTasks(data);
      } catch (e) {
        console.error("Failed to fetch tasks for heatmap", e);
      }
    };
    fetchTasks();
  }, []);

  const changeHandler = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({ ...prev, profileImage: reader.result }));
    reader.readAsDataURL(file);
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
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender,
      phone: formData.phone,
      bio: formData.bio,
      address: {
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      },
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
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone,
        bio: data.bio,
        address: data.address,
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
    if (
      window.confirm(
        "Are you absolutely sure you want to delete your account? This action cannot be undone."
      )
    ) {
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

  const getHeatmapData = () => {
    const counts = {};
    tasks.forEach((task) => {
      if (task.status === "Done" && task.updatedAt) {
        const dateStr = task.updatedAt.split("T")[0];
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      }
    });
    return Object.keys(counts).map((date) => ({ date, count: counts[date] }));
  };

  const shiftDate = (date, numDays) => {
    const d = new Date(date);
    d.setDate(d.getDate() + numDays);
    return d;
  };
  const today = new Date();

  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-900 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information, contact details, and account security.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── LEFT SIDEBAR ── */}
          <div className="space-y-5">

            {/* Avatar Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60">
              <div className="relative mx-auto mb-4 h-24 w-24">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-100 dark:ring-indigo-900/40"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white ring-4 ring-indigo-100 dark:ring-indigo-900/40">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700 hover:scale-110"
                  title="Change photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                {user.role}
              </div>
              {formData.bio && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {formData.bio}
                </p>
              )}
            </div>

            {/* Stats Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Task Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Tasks", value: totalTasks, color: "text-indigo-600 dark:text-indigo-400" },
                  { label: "Completed", value: completedTasks, color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length, color: "text-amber-600 dark:text-amber-400" },
                  { label: "Completion %", value: totalTasks ? `${Math.round((completedTasks / totalTasks) * 100)}%` : "0%", color: "text-purple-600 dark:text-purple-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60">
              <h3 className="mb-1 font-bold text-slate-900 dark:text-white text-sm">Productivity Heatmap</h3>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">Task completions over 5 months</p>
              <style>{`
                .react-calendar-heatmap .color-empty { fill: #f1f5f9; }
                .react-calendar-heatmap .color-scale-1 { fill: #c7d2fe; }
                .react-calendar-heatmap .color-scale-2 { fill: #818cf8; }
                .react-calendar-heatmap .color-scale-3 { fill: #4f46e5; }
                .react-calendar-heatmap .color-scale-4 { fill: #312e81; }
                .dark .react-calendar-heatmap .color-empty { fill: #1e293b; }
                .dark .react-calendar-heatmap .color-scale-1 { fill: #4f46e5; opacity:0.35; }
                .dark .react-calendar-heatmap .color-scale-2 { fill: #4f46e5; opacity:0.6; }
                .dark .react-calendar-heatmap .color-scale-3 { fill: #4f46e5; opacity:0.8; }
                .dark .react-calendar-heatmap .color-scale-4 { fill: #4f46e5; }
                .react-calendar-heatmap text { font-size:8px; fill:#94a3b8; }
              `}</style>
              <CalendarHeatmap
                startDate={shiftDate(today, -150)}
                endDate={today}
                values={getHeatmapData()}
                classForValue={(v) => {
                  if (!v || v.count === 0) return "color-empty";
                  if (v.count === 1) return "color-scale-1";
                  if (v.count === 2) return "color-scale-2";
                  if (v.count === 3) return "color-scale-3";
                  return "color-scale-4";
                }}
                titleForValue={(v) =>
                  v?.date ? `${v.count} tasks on ${v.date}` : "No tasks"
                }
              />
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={logoutHandler}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
              >
                <LogOut className="h-4 w-4" /> Logout Session
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-slate-400 transition hover:text-red-500 dark:hover:text-red-400"
              >
                <AlertTriangle className="h-3.5 w-3.5" /> Delete Account
              </button>
            </div>
          </div>

          {/* ── RIGHT MAIN FORM ── */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60">

              {/* Tab Bar */}
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                {TABS.map((tab, i) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                      activeTab === i
                        ? "border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form onSubmit={submitHandler} className="p-6">

                {/* ─── TAB 0: Personal Info ─── */}
                {activeTab === 0 && (
                  <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField label="Full Name" icon={User}>
                        <input
                          id="profile-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={changeHandler}
                          required
                          placeholder="Your full name"
                          className={inputCls}
                        />
                      </InputField>
                      <InputField label="Email Address" icon={Mail}>
                        <input
                          id="profile-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={changeHandler}
                          required
                          placeholder="your@email.com"
                          className={inputCls}
                        />
                      </InputField>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField label="Date of Birth" icon={Calendar}>
                        <input
                          id="profile-dob"
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={changeHandler}
                          max={new Date().toISOString().split("T")[0]}
                          className={inputCls}
                        />
                      </InputField>
                      <InputField label="Gender" icon={ChevronDown}>
                        <select
                          id="profile-gender"
                          name="gender"
                          value={formData.gender}
                          onChange={changeHandler}
                          className={inputCls}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </InputField>
                    </div>

                    <InputField
                      label="Bio"
                      icon={FileText}
                      hint={`${formData.bio.length}/300 characters`}
                    >
                      <textarea
                        id="profile-bio"
                        name="bio"
                        value={formData.bio}
                        onChange={changeHandler}
                        rows={3}
                        maxLength={300}
                        placeholder="Write a short bio about yourself..."
                        className={`${inputCls} resize-none`}
                      />
                    </InputField>
                  </div>
                )}

                {/* ─── TAB 1: Contact & Address ─── */}
                {activeTab === 1 && (
                  <div className="space-y-5">
                    <InputField label="Phone Number" icon={Phone}>
                      <input
                        id="profile-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={changeHandler}
                        placeholder="+91 98765 43210"
                        className={inputCls}
                      />
                    </InputField>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700/50 dark:bg-slate-900/40">
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <Home className="h-4 w-4 text-indigo-500" />
                        Address
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <InputField label="City" icon={MapPin}>
                          <input
                            id="profile-city"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={changeHandler}
                            placeholder="Mumbai"
                            className={inputCls}
                          />
                        </InputField>
                        <InputField label="State / Province" icon={MapPin}>
                          <input
                            id="profile-state"
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={changeHandler}
                            placeholder="Maharashtra"
                            className={inputCls}
                          />
                        </InputField>
                        <InputField label="Country" icon={Globe}>
                          <input
                            id="profile-country"
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={changeHandler}
                            placeholder="India"
                            className={inputCls}
                          />
                        </InputField>
                        <InputField label="PIN / ZIP Code" icon={MapPin}>
                          <input
                            id="profile-pincode"
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={changeHandler}
                            placeholder="400001"
                            className={inputCls}
                          />
                        </InputField>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 2: Security ─── */}
                {activeTab === 2 && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400">
                      <strong>Note:</strong> Leave the password fields blank if you don't want to change your password.
                    </div>
                    <InputField label="New Password" icon={Lock}>
                      <div className="relative">
                        <input
                          id="profile-password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={changeHandler}
                          placeholder="Minimum 6 characters"
                          className={`${inputCls} pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </InputField>
                    <InputField label="Confirm New Password" icon={Lock}>
                      <div className="relative">
                        <input
                          id="profile-confirm-password"
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={changeHandler}
                          placeholder="Re-enter new password"
                          className={`${inputCls} pr-10 ${
                            formData.confirmPassword && formData.password !== formData.confirmPassword
                              ? "border-red-400 focus:ring-red-400/20"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                      )}
                    </InputField>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const stored = JSON.parse(localStorage.getItem("user") || "{}");
                      setFormData({
                        name: stored.name || "",
                        email: stored.email || "",
                        profileImage: stored.profileImage || "",
                        dateOfBirth: stored.dateOfBirth ? stored.dateOfBirth.split("T")[0] : "",
                        gender: stored.gender || "",
                        bio: stored.bio || "",
                        phone: stored.phone || "",
                        city: stored.address?.city || "",
                        state: stored.address?.state || "",
                        country: stored.address?.country || "",
                        pincode: stored.address?.pincode || "",
                        password: "",
                        confirmPassword: "",
                      });
                    }}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

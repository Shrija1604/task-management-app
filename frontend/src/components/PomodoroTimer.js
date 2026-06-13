import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Square, Coffee, Settings } from "lucide-react";
import { toast } from "react-hot-toast";
import { addFocusSession } from "../services/focusSessionService";

const PomodoroTimer = ({ task, onCompleteSession }) => {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // 'focus' or 'break'
  const [showSettings, setShowSettings] = useState(false);

  const timerRef = useRef(null);

  const handleSessionComplete = useCallback(() => {
    setIsActive(false);
    clearInterval(timerRef.current);

    if (mode === "focus") {
      toast.success("Focus session completed! Take a break.");
      if (onCompleteSession) onCompleteSession(task._id);

      addFocusSession(task._id, {
        duration: focusTime,
        startTime: new Date(Date.now() - focusTime * 60 * 1000).toISOString(),
        completed: true
      }).catch(err => console.error("Failed to save focus session:", err));

      setMode("break");
      setTimeLeft(breakTime * 60);
    } else {
      toast("Break over. Back to work!", { icon: "☕" });
      setMode("focus");
      setTimeLeft(focusTime * 60);
    }
  }, [mode, onCompleteSession, task._id, focusTime, breakTime]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSessionComplete();
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, handleSessionComplete]);

  useEffect(() => {
    if (!isActive) {
      if (mode === "focus") setTimeLeft(focusTime * 60);
      else setTimeLeft(breakTime * 60);
    }
  }, [focusTime, breakTime, isActive, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode("focus");
    setTimeLeft(focusTime * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full">
      <div className={`mt-3 flex items-center justify-between rounded-lg p-2 transition-colors ${mode === 'focus' ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-green-50 dark:bg-green-500/10'}`}>
        <div className="flex items-center gap-3">
          <div className={`text-xl font-bold tabular-nums tracking-wider ${mode === 'focus' ? 'text-indigo-600 dark:text-indigo-400' : 'text-green-600 dark:text-green-400'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTimer}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors ${mode === 'focus'
                ? 'bg-indigo-500 hover:bg-indigo-600'
                : 'bg-green-500 hover:bg-green-600'
                }`}
              title={isActive ? "Pause" : "Start"}
            >
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
            <button
              onClick={resetTimer}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-red-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-red-400"
              title="Reset"
            >
              <Square className="h-4 w-4" />
            </button>
            {!isActive && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors ${showSettings ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-300'}`}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider ${mode === 'focus' ? 'text-indigo-500' : 'text-green-500'}`}>
            {mode === 'focus' ? 'Focus' : 'Break'}
          </span>
          {mode === 'break' && <Coffee className="h-4 w-4 text-green-500" />}
        </div>
      </div>

      {showSettings && !isActive && (
        <div className="mt-2 flex items-center justify-between gap-4 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 w-full animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Focus</label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={focusTime}
                onChange={e => setFocusTime(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 px-2 py-1 text-sm border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                min="1"
                max="120"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <label className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Break</label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={breakTime}
                onChange={e => setBreakTime(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 px-2 py-1 text-sm border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;

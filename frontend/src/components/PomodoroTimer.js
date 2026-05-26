import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Square, Coffee } from "lucide-react";
import { toast } from "react-hot-toast";

const PomodoroTimer = ({ task, onCompleteSession }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // 'focus' or 'break'
  
  const timerRef = useRef(null);

  const handleSessionComplete = useCallback(() => {
    setIsActive(false);
    clearInterval(timerRef.current);
    
    if (mode === "focus") {
      toast.success("Focus session completed! Take a break.");
      if (onCompleteSession) onCompleteSession(task._id);
      setMode("break");
      setTimeLeft(5 * 60); // 5 min break
    } else {
      
      toast("Break over. Back to work!", { icon: "☕" });
      setMode("focus");
      setTimeLeft(25 * 60); // 25 min focus
    }
  }, [mode, onCompleteSession, task._id]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, handleSessionComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setMode("focus");
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`mt-3 flex items-center justify-between rounded-lg p-2 ${mode === 'focus' ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-green-50 dark:bg-green-500/10'}`}>
      <div className="flex items-center gap-3">
        <div className={`text-xl font-bold tabular-nums tracking-wider ${mode === 'focus' ? 'text-indigo-600 dark:text-indigo-400' : 'text-green-600 dark:text-green-400'}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTimer}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors ${
              mode === 'focus' 
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
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold uppercase tracking-wider ${mode === 'focus' ? 'text-indigo-500' : 'text-green-500'}`}>
          {mode === 'focus' ? 'Focus' : 'Break'}
        </span>
        {mode === 'break' && <Coffee className="h-4 w-4 text-green-500" />}
      </div>
    </div>
  );
};

export default PomodoroTimer;

import React from "react";
import CalendarView from "../components/CalendarView";
import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import Loader from "../components/Loader";

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="main-content">
      <div className="topbar">
        <h1>Calendar View</h1>
      </div>
      <CalendarView tasks={tasks} />
    </div>
  );
};

export default CalendarPage;

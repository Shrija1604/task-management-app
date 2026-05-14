import React from "react";
import CalendarView from "../components/CalendarView";
import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import { getCategories } from "../services/categoryService";
import Loader from "../components/Loader";

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskData, catData] = await Promise.all([
          getTasks(),
          getCategories()
        ]);
        setTasks(taskData);
        setCategories(catData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="main-content">
      <div className="topbar">
        <h1>Calendar View</h1>
      </div>
      <CalendarView tasks={tasks} categories={categories} />
    </div>
  );
};

export default CalendarPage;

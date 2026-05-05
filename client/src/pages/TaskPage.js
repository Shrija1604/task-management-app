useEffect(() => {
  fetchTasks();
}, []);

const fetchTasks = async () => {
  const res = await getTasks();
  setTasks(res.data);
};
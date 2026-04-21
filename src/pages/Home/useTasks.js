import { useState, useEffect } from "react";

export function useTasks() {

  // 🔹 carrega do localStorage ao iniciar
  const [tasks, setTasks] = useState(() => {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
  });

  const [showForm, setShowForm] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // 🔹 salva automaticamente sempre que mudar
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(status) {
    if (!title.trim()) return;

    setTasks(prev => [
      ...prev,
      { id: crypto.randomUUID(), title, desc, status }
    ]);

    setTitle("");
    setDesc("");
    setShowForm(null);
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function startEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTitle(task.title);
    setDesc(task.desc);
    setShowForm(task.status);

    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function editTask(id, newStatus) {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: newStatus } : t
      )
    );
  }

  return {
    tasks,
    showForm,
    setShowForm,
    title,
    setTitle,
    desc,
    setDesc,
    addTask,
    deleteTask,
    startEdit,
    editTask
  };
}
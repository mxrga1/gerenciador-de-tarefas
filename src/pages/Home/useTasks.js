import { useState, useEffect } from "react";

export function useTasks() {

  // 🔹 carrega do localStorage ao iniciar
  const [tasks, setTasks] = useState(() => {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
  });

const [showForm, setShowForm] = useState(null);
const [editingId, setEditingId] = useState(null);


const [title, setTitle] = useState("");
const [desc, setDesc] = useState("");

  // 🔹 salva automaticamente sempre que mudar
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

function addTask(status) {
  if (!title.trim()) return;

  if (editingId) {
    setTasks(prev =>
      prev.map(t =>
        t.id === editingId
          ? { ...t, title, desc, status }
          : t
      )
    );

    setEditingId(null);
  } else {
    setTasks(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        desc,
        status
      }
    ]);
  }

  setTitle("");
  setDesc("");
  setShowForm(null);
}

function deleteTask(id) {
  setTasks(prev => prev.filter(t => t.id !== id));

  if (editingId === id) {
    setEditingId(null);
    setShowForm(null);
    setTitle("");
    setDesc("");
  }
}

function startEdit(id) {
  const task = tasks.find(t => t.id === id);

  if (!task) return;

  setEditingId(id);

  setTitle(task.title);
  setDesc(task.desc);
  setShowForm(task.status);
}

function cancelEdit() {
  setEditingId(null);
  setTitle("");
  setDesc("");
  setShowForm(null);
}

function editTask(id, targetId) {

  setTasks(prev => {

    const activeTask = prev.find(t => t.id === id);
    const targetTask = prev.find(t => t.id === targetId);

    if (!activeTask || !targetTask) return prev;

    const updated = [...prev];

    const oldIndex = updated.findIndex(t => t.id === id);
    const newIndex = updated.findIndex(t => t.id === targetId);

    updated[oldIndex] = {
      ...updated[oldIndex],
      status: targetTask.status
    };

    const movedItem = updated.splice(oldIndex, 1)[0];

    updated.splice(newIndex, 0, movedItem);

    return updated;
  });
}
  return { tasks, setTasks, showForm, setShowForm, title, setTitle, desc, setDesc, addTask, deleteTask, startEdit, editTask, cancelEdit, editingId};
}
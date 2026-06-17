import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../Auth/Supabaseclient.js";

// ─── Hook de tarefas e colunas ──────────────────────────────────────────
// Substitui a versão antiga baseada em localStorage. Mantém praticamente a
// mesma API (tasks, columns, addTask, deleteTask, etc.) para que Home.jsx
// precise de poucas mudanças, mas agora tudo é lido/escrito no Supabase e
// sincronizado em tempo real entre todos os membros do board.

function mapTaskRow(row) {
  return {
    id:           row.id,
    title:        row.title,
    desc:         row.description ?? "",
    status:       row.column_id, // mantemos "status" = id da coluna, como antes
    position:     row.position,
    lastEditedBy: row.last_edited_by,
    lastEditedByName: row.editor?.username ?? null,
    updatedAt:    row.updated_at,
  };
}

function mapColumnRow(row) {
  return {
    id:    row.id,
    title: row.title,
    color: row.color,
    fixed: !!row.fixed_key,
    fixedKey: row.fixed_key,
    position: row.position,
  };
}

export function useTasks(boardId, currentUser) {
  const [tasks,   setTasksState]   = useState([]);
  const [columns, setColumnsState] = useState([]);

  const [showForm,  setShowForm]  = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [title,     setTitle]     = useState("");
  const [desc,      setDesc]      = useState("");

  const userId = currentUser?.id ?? null;

  // ─── Carregamento inicial ───────────────────────────────────────────────
  const loadColumns = useCallback(async () => {
    if (!boardId) return;
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true });

    if (error) { console.error("Erro ao carregar colunas:", error); return; }
    setColumnsState((data ?? []).map(mapColumnRow));
  }, [boardId]);

  const loadTasks = useCallback(async () => {
    if (!boardId) return;
    const { data, error } = await supabase
      .from("tasks")
      .select("*, editor:last_edited_by ( username )")
      .eq("board_id", boardId)
      .order("position", { ascending: true });

    if (error) { console.error("Erro ao carregar tarefas:", error); return; }
    setTasksState((data ?? []).map(mapTaskRow));
  }, [boardId]);

  useEffect(() => {
    setShowForm(null);
    setEditingId(null);
    setTitle("");
    setDesc("");
    if (boardId) {
      loadColumns();
      loadTasks();
    } else {
      setTasksState([]);
      setColumnsState([]);
    }
  }, [boardId, loadColumns, loadTasks]);

  // ─── Realtime: sincroniza com outros membros do board ──────────────────
  useEffect(() => {
    if (!boardId) return;

    const channel = supabase
      .channel(`board-${boardId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks", filter: `board_id=eq.${boardId}` }, loadTasks)
      .on("postgres_changes", { event: "*", schema: "public", table: "columns", filter: `board_id=eq.${boardId}` }, loadColumns)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [boardId, loadTasks, loadColumns]);

  // ─── setTasks / setColumns "compatíveis" para o drag-and-drop ──────────
  // O dnd-kit no Home.jsx usa setTasks/setColumns com uma função de
  // atualização local (otimista) e depois precisamos persistir no banco.
  // Para manter a UI fluida durante o drag, atualizamos o estado local
  // imediatamente e disparamos a gravação em segundo plano.

  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  function setTasks(updater) {
    setTasksState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistTaskChanges(prev, next);
      return next;
    });
  }

  async function persistTaskChanges(prev, next) {
    // Grava a posição/coluna atual de toda task cuja coluna OU índice mudou
    // (cobre tanto mover entre colunas quanto reordenar dentro da mesma)
    const prevById = new Map(prev.map((t) => [t.id, t]));
    const prevIndexById = new Map(prev.map((t, idx) => [t.id, idx]));
    const updates = [];

    next.forEach((task, index) => {
      const before = prevById.get(task.id);
      const statusChanged = !before || before.status !== task.status;
      const indexChanged  = prevIndexById.get(task.id) !== index;
      if (statusChanged || indexChanged) {
        updates.push({ id: task.id, column_id: task.status, position: index, statusChanged });
      }
    });

    if (updates.length === 0) return;

    // Grava em lote; cada linha recebe last_edited_by quando a coluna muda
    await Promise.all(
      updates.map(({ id, column_id, position, statusChanged }) => {
        const payload = { column_id, position };
        if (statusChanged) {
          payload.last_edited_by = userId;
        }
        return supabase.from("tasks").update(payload).eq("id", id);
      })
    );
  }

  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  function setColumns(updater) {
    setColumnsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistColumnOrder(next);
      return next;
    });
  }

  async function persistColumnOrder(next) {
    await Promise.all(
      next.map((col, index) => supabase.from("columns").update({ position: index }).eq("id", col.id))
    );
  }

  // ─── Ações de tarefa ─────────────────────────────────────────────────────

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDesc("");
    setShowForm(null);
  }

  async function addTask(status) {
    if (!title.trim()) return;

    if (editingId) {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: title.trim(),
          description: desc.trim(),
          column_id: status,
          last_edited_by: userId,
        })
        .eq("id", editingId);

      if (error) console.error("Erro ao editar tarefa:", error);
      setEditingId(null);
    } else {
      const position = tasksRef.current.filter((t) => t.status === status).length;
      const { error } = await supabase.from("tasks").insert({
        board_id: boardId,
        column_id: status,
        title: title.trim(),
        description: desc.trim(),
        position,
        last_edited_by: userId,
      });

      if (error) console.error("Erro ao criar tarefa:", error);
    }

    setTitle("");
    setDesc("");
    setShowForm(null);
    loadTasks();
  }

  async function deleteTask(id) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) console.error("Erro ao excluir tarefa:", error);
    if (editingId === id) resetForm();
    loadTasks();
  }

  function startEdit(id) {
    const task = tasksRef.current.find((t) => t.id === id);
    if (!task) return;
    setEditingId(id);
    setTitle(task.title);
    setDesc(task.desc);
    setShowForm(task.status);
  }

  function cancelEdit() {
    resetForm();
  }

  // ─── Ações de coluna ─────────────────────────────────────────────────────

  async function addColumn(columnTitle) {
    const cleaned = columnTitle.trim();
    if (!cleaned || !boardId) return;

    // Insere antes da coluna "done" (mantendo o comportamento original)
    const doneIndex = columnsRef.current.findIndex((c) => c.fixedKey === "done");
    const newPosition = doneIndex >= 0 ? doneIndex : columnsRef.current.length;

    // Reabre espaço: empurra a coluna "done" (e qualquer coisa depois) +1
    await Promise.all(
      columnsRef.current
        .filter((_, idx) => idx >= newPosition)
        .map((col) => supabase.from("columns").update({ position: col.position + 1 }).eq("id", col.id))
    );

    const { error } = await supabase.from("columns").insert({
      board_id: boardId,
      title: cleaned,
      fixed_key: null,
      position: newPosition,
    });

    if (error) console.error("Erro ao criar coluna:", error);
    loadColumns();
  }

  async function updateColumn(id, { title: newTitle, color }) {
    const { error } = await supabase.from("columns").update({ title: newTitle, color }).eq("id", id);
    if (error) console.error("Erro ao atualizar coluna:", error);
    loadColumns();
  }

  async function deleteColumn(id) {
    const column = columnsRef.current.find((c) => c.id === id);
    if (!column || column.fixedKey === "done") return;

    const { error } = await supabase.from("columns").delete().eq("id", id);
    if (error) console.error("Erro ao excluir coluna:", error);

    if (showForm === id) resetForm();
    const editingTask = tasksRef.current.find((t) => t.id === editingId);
    if (editingTask?.status === id) resetForm();

    loadColumns();
    loadTasks();
  }

  return {
    tasks,      setTasks,
    columns,    setColumns,
    showForm,   setShowForm,
    title,      setTitle,
    desc,       setDesc,
    addTask,    deleteTask,
    startEdit,  cancelEdit, editingId,
    addColumn,  deleteColumn, updateColumn,
  };
}
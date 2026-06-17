import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTasks } from "./useTasks";
import { useBoards } from "./useBoards";
import { Sidebar } from "./Sidebar";
import { InvitesBell } from "./InvitesBell";
import { Avatar } from "./avatar";
import {
  KbRoot, KbHeader, KbTitle, HeaderActions,
  KbAddBtn, KbBoard, KbCol, KbColHeader, KbDot, KbColLabel,
  KbCard, KbCardTitle, KbCardDesc, KbStats, KbStat, KbStatNum,
  KbStatLabel, KbProgressBar, KbProgressFill, KbCount, KbForm,
  KbInput, KbCreateBtn, KbCancelBtn, KbMenuWrapper, KbMenuBtn,
  KbDropdown, KbDropdownItem, KbCardHeader, KbCardContent,
  KbAddColumn, KbBoardWrapper, KbTaskList, KbPortalDropdown,
  KbCardFooterRow
} from "./style";

import {
  DndContext, useDroppable, pointerWithin, DragOverlay
} from "@dnd-kit/core";
import {
  SortableContext, useSortable,
  verticalListSortingStrategy, horizontalListSortingStrategy, arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";

// ─── Layout ───────────────────────────────────────────────────────────────────

const AppShell = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainArea = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const LogoutBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.18);
  border-radius: 7px;
  cursor: pointer;
  color: #4b4b47;
  transition: all 0.15s;

  &:hover {
    background: #f5f4ef;
    border-color: rgba(0, 0, 0, 0.32);
    color: #1a1a18;
  }

  &:active {
    background: #eceae3;
  }
`;

// ─── Constantes ───────────────────────────────────────────────────────────────

const COLOR_OPTIONS = [
  { label: "Cinza",    value: "#888780" },
  { label: "Azul",    value: "#378ADD" },
  { label: "Verde",   value: "#639922" },
  { label: "Roxo",    value: "#8B5CF6" },
  { label: "Laranja", value: "#F59E0B" },
  { label: "Rosa",    value: "#EC4899" },
  { label: "Vermelho",value: "#EF4444" },
  { label: "Teal",    value: "#14B8A6" },
];

function getDefaultColor(fixedKey) {
  if (fixedKey === "pending")  return "#888780";
  if (fixedKey === "progress") return "#378ADD";
  if (fixedKey === "done")     return "#639922";
  return "#9ca3af";
}

function getVariantByFixedKey(fixedKey) {
  if (fixedKey === "pending")  return "pending";
  if (fixedKey === "progress") return "progress";
  if (fixedKey === "done")     return "done";
  return "custom";
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function DraggableTask({ task, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}>
      {children({ listeners, attributes })}
    </div>
  );
}

function SortableColumn({ column, children }) {
  const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } =
    useSortable({ id: column.id, data: { type: "column" } });
  const { setNodeRef: setDroppableRef } = useDroppable({ id: column.id, data: { type: "column" } });

  const setNodeRef = (node) => { setSortableRef(node); setDroppableRef(node); };

  return (
    <KbCol ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}>
      {children({ listeners, attributes })}
    </KbCol>
  );
}

// Menu de tarefa renderizado via portal, posicionado a partir do botão "⋮".
// Evita que o overflow/scroll de KbTaskList ou KbCol corte o dropdown
// quando o card está perto do fim da lista.
function TaskMenuPortal({ anchorRef, onEdit, onDelete, onClose }) {
  const [coords, setCoords] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function place() {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCoords({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !anchorRef.current?.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [anchorRef, onClose]);

  if (!coords) return null;

  return createPortal(
    <KbPortalDropdown
      ref={dropdownRef}
      data-menu
      style={{ top: coords.top, right: coords.right }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <KbDropdownItem onClick={onEdit}>Editar</KbDropdownItem>
      <KbDropdownItem $danger onClick={onDelete}>Excluir</KbDropdownItem>
    </KbPortalDropdown>,
    document.body
  );
}

function TaskCard({ task, openMenuId, setOpenMenuId, startEdit, deleteTask }) {
  const wrapperRef = useRef(null);
  const menuBtnRef = useRef(null);
  const isMenuOpen = openMenuId === task.id;

  return (
    <DraggableTask task={task}>
      {({ listeners, attributes }) => (
        <KbCard {...listeners} {...attributes}>
          <KbCardHeader>
            <KbCardContent>
              <KbCardTitle>{task.title}</KbCardTitle>
              <KbCardDesc>{task.desc}</KbCardDesc>
            </KbCardContent>

            <KbMenuWrapper ref={wrapperRef} data-menu onPointerDown={(e) => e.stopPropagation()}>
              <KbMenuBtn
                ref={menuBtnRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(isMenuOpen ? null : task.id);
                }}
              >
                ⋮
              </KbMenuBtn>

              {isMenuOpen && (
                <TaskMenuPortal
                  anchorRef={menuBtnRef}
                  onEdit={() => { startEdit(task.id); setOpenMenuId(null); }}
                  onDelete={() => { deleteTask(task.id); setOpenMenuId(null); }}
                  onClose={() => setOpenMenuId(null)}
                />
              )}
            </KbMenuWrapper>
          </KbCardHeader>

          {/* Avatar de quem editou por último (iniciais coloridas) */}
          {task.lastEditedByName && (
            <KbCardFooterRow onPointerDown={(e) => e.stopPropagation()}>
              <Avatar
                name={task.lastEditedByName}
                size={18}
                title={`Última edição: ${task.lastEditedByName}`}
              />
            </KbCardFooterRow>
          )}
        </KbCard>
      )}
    </DraggableTask>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
// `user` vem do useAuth: { id, username }. `onLogout` desloga via Supabase Auth.

export function Home({ user, onLogout }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; document.documentElement.style.overflow = ""; };
  }, []);

  const {
    boards, activeBoardId, setActiveBoardId, addBoard, deleteBoard, renameBoard,
    invites, inviteUser, acceptInvite, declineInvite,
  } = useBoards(user);

  const {
    tasks, setTasks, columns, setColumns,
    showForm, setShowForm, title, setTitle, desc, setDesc,
    addTask, deleteTask, startEdit, cancelEdit,
    addColumn, deleteColumn, updateColumn,
  } = useTasks(activeBoardId, user);

  const [taskMenuOpen,   setTaskMenuOpen]   = useState(null);
  const [columnMenuOpen, setColumnMenuOpen] = useState(null);
  const [activeTask,     setActiveTask]     = useState(null);
  const [showColumnForm, setShowColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumn,  setEditingColumn]  = useState(null);

  // Fecha qualquer dropdown ao clicar fora
  const closeAll = useCallback(() => {
    setTaskMenuOpen(null);
    setColumnMenuOpen(null);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("[data-menu]")) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeAll]);

  const done = tasks.filter((t) => columns.find((c) => c.id === t.status)?.fixedKey === "done");
  const activeBoardTitle = boards.find((b) => b.id === activeBoardId)?.title ?? "Gerenciador de tarefas";

  function saveColumnEdit() {
    if (!editingColumn?.title.trim()) return;
    updateColumn(editingColumn.id, { title: editingColumn.title, color: editingColumn.color });
    setEditingColumn(null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const isActiveColumn = columns.some((c) => c.id === active.id);
    const isOverColumn   = columns.some((c) => c.id === over.id);

    if (isActiveColumn) {
      let targetColumnId = over.id;
      if (!isOverColumn) {
        const overTask = tasks.find((t) => t.id === over.id);
        if (overTask) targetColumnId = overTask.status;
      }
      const oldIndex  = columns.findIndex((c) => c.id === active.id);
      const newIndex  = columns.findIndex((c) => c.id === targetColumnId);
      const doneIndex = columns.findIndex((c) => c.fixedKey === "done");
      if (newIndex >= doneIndex) return;
      if (oldIndex !== newIndex) setColumns(arrayMove(columns, oldIndex, newIndex));
      return;
    }

    setTasks((prev) => {
      const activeTaskItem = prev.find((t) => t.id === active.id);
      if (!activeTaskItem) return prev;
      if (isOverColumn) return prev.map((t) => t.id === active.id ? { ...t, status: over.id } : t);
      const overTask = prev.find((t) => t.id === over.id);
      if (!overTask) return prev;
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      const updated  = [...prev];
      updated[oldIndex] = { ...updated[oldIndex], status: overTask.status };
      return arrayMove(updated, oldIndex, newIndex);
    });
  }

  return (
    <AppShell>
      <Sidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={(id) => { setActiveBoardId(id); setEditingColumn(null); setColumnMenuOpen(null); setTaskMenuOpen(null); }}
        onAddBoard={addBoard}
        onDeleteBoard={deleteBoard}
        onRenameBoard={renameBoard}
        onInviteUser={inviteUser}
      />

      <MainArea>
        <KbRoot>
          <KbHeader>
            <KbTitle>{activeBoardTitle}</KbTitle>
            <HeaderActions>
              <InvitesBell invites={invites} onAccept={acceptInvite} onDecline={declineInvite} />
              <LogoutBtn type="button" onClick={onLogout}>
                Sair
              </LogoutBtn>
            </HeaderActions>
          </KbHeader>

          <KbStats>
            <KbStat>
              <KbStatNum>{tasks.length}</KbStatNum>
              <KbStatLabel>Tarefas</KbStatLabel>
            </KbStat>
            <KbStat>
              <KbStatNum>{done.length}</KbStatNum>
              <KbStatLabel>Concluídas</KbStatLabel>
              <KbProgressBar>
                <KbProgressFill $width={tasks.length ? (done.length / tasks.length) * 100 : 0} />
              </KbProgressBar>
            </KbStat>
          </KbStats>

          <DndContext
            collisionDetection={pointerWithin}
            onDragStart={({ active }) => { setActiveTask(tasks.find((t) => t.id === active.id) || null); }}
            onDragEnd={(event) => { handleDragEnd(event); setActiveTask(null); }}
            onDragCancel={() => setActiveTask(null)}
          >
            <KbBoardWrapper>
              <SortableContext items={columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
                <KbBoard>
                  {columns.map((column) => {
                    const columnTasks = tasks.filter((t) => t.status === column.id);
                    const variant     = getVariantByFixedKey(column.fixedKey);
                    const dotColor    = column.color || null;

                    return (
                      <SortableColumn column={column} key={column.id}>
                        {({ listeners, attributes }) => (
                          <>
                            {/* Cabeçalho */}
                            <KbColHeader {...listeners} {...attributes} style={{ cursor: "grab" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
                                <KbDot $variant={variant} $color={dotColor} />
                                <KbColLabel>{column.title}</KbColLabel>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <KbCount $variant={variant} $color={dotColor}>
                                  {columnTasks.length}
                                </KbCount>

                                <KbMenuWrapper data-menu onPointerDown={(e) => e.stopPropagation()}>
                                  <KbMenuBtn
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setColumnMenuOpen(columnMenuOpen === column.id ? null : column.id);
                                    }}
                                  >
                                    ⋮
                                  </KbMenuBtn>

                                  {columnMenuOpen === column.id && (
                                    <KbDropdown data-menu>
                                      <KbDropdownItem
                                        onClick={() => {
                                          setEditingColumn({ id: column.id, title: column.title, color: column.color || getDefaultColor(column.fixedKey) });
                                          setColumnMenuOpen(null);
                                        }}
                                      >
                                        Editar
                                      </KbDropdownItem>
                                      {column.fixedKey !== "done" && (
                                        <KbDropdownItem $danger onClick={() => { deleteColumn(column.id); setColumnMenuOpen(null); }}>
                                          Excluir
                                        </KbDropdownItem>
                                      )}
                                    </KbDropdown>
                                  )}
                                </KbMenuWrapper>
                              </div>
                            </KbColHeader>

                            {/* Form edição coluna */}
                            {editingColumn?.id === column.id && (
                              <KbForm onPointerDown={(e) => e.stopPropagation()}>
                                <KbInput
                                  maxLength={40}
                                  placeholder="Nome da coluna"
                                  value={editingColumn.title}
                                  onChange={(e) => setEditingColumn((prev) => ({ ...prev, title: e.target.value }))}
                                />
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", padding: "2px 0" }}>
                                  {COLOR_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      title={opt.label}
                                      onClick={() => setEditingColumn((prev) => ({ ...prev, color: opt.value }))}
                                      style={{
                                        width: 22, height: 22, borderRadius: "50%", background: opt.value,
                                        cursor: "pointer", padding: 0, flexShrink: 0,
                                        border: editingColumn.color === opt.value ? "2px solid #111" : "2px solid transparent",
                                        outline: editingColumn.color === opt.value ? "2px solid #fff" : "none",
                                        outlineOffset: "-3px",
                                      }}
                                    />
                                  ))}
                                </div>
                                <KbCreateBtn type="button" onClick={saveColumnEdit}>Salvar</KbCreateBtn>
                                <KbCancelBtn type="button" onClick={() => setEditingColumn(null)}>Cancelar</KbCancelBtn>
                              </KbForm>
                            )}

                            {/* Tarefas */}
                            <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                              <KbTaskList>
                                {columnTasks.map((task) => (
                                  <TaskCard
                                    key={task.id}
                                    task={task}
                                    openMenuId={taskMenuOpen}
                                    setOpenMenuId={(id) => {
                                      setTaskMenuOpen(id);
                                      if (id) setColumnMenuOpen(null);
                                    }}
                                    startEdit={startEdit}
                                    deleteTask={deleteTask}
                                  />
                                ))}
                              </KbTaskList>
                            </SortableContext>

                            {/* Form nova tarefa */}
                            {showForm === column.id ? (
                              <KbForm>
                                <KbInput maxLength={35} placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
                                <KbInput maxLength={125} placeholder="Descrição" value={desc} onChange={(e) => setDesc(e.target.value)} />
                                <KbCreateBtn type="button" onClick={() => addTask(column.id)}>Criar</KbCreateBtn>
                                <KbCancelBtn type="button" onClick={cancelEdit}>Cancelar</KbCancelBtn>
                              </KbForm>
                            ) : (
                              <KbAddBtn type="button" onClick={() => setShowForm(column.id)}>+ Criar</KbAddBtn>
                            )}
                          </>
                        )}
                      </SortableColumn>
                    );
                  })}

                  {showColumnForm ? (
                    <KbCol>
                      <KbForm>
                        <KbInput maxLength={40} placeholder="Nome da coluna" value={newColumnTitle} onChange={(e) => setNewColumnTitle(e.target.value)} />
                        <KbCreateBtn type="button" onClick={() => { if (!newColumnTitle.trim()) return; addColumn(newColumnTitle); setNewColumnTitle(""); setShowColumnForm(false); }}>
                          Adicionar coluna
                        </KbCreateBtn>
                        <KbCancelBtn type="button" onClick={() => { setNewColumnTitle(""); setShowColumnForm(false); }}>
                          Cancelar
                        </KbCancelBtn>
                      </KbForm>
                    </KbCol>
                  ) : (
                    <KbAddColumn type="button" onClick={() => setShowColumnForm(true)}>
                      <span>+</span>
                      <span>Adicionar coluna</span>
                    </KbAddColumn>
                  )}
                </KbBoard>
              </SortableContext>
            </KbBoardWrapper>

            <DragOverlay>
              {activeTask ? (
                <KbCard>
                  <KbCardHeader>
                    <KbCardContent>
                      <KbCardTitle>{activeTask.title}</KbCardTitle>
                      <KbCardDesc>{activeTask.desc}</KbCardDesc>
                    </KbCardContent>
                  </KbCardHeader>
                </KbCard>
              ) : null}
            </DragOverlay>
          </DndContext>
        </KbRoot>
      </MainArea>
    </AppShell>
  );
}
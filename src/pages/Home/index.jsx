import { useState } from "react"; 
import { useTasks } from "./useTasks";
import { KbRoot, KbHeader, KbTitle, HeaderActions, KbAddBtn, KbBadge, KbBoard, KbCol, KbColHeader, KbDot, KbColLabel, KbCard, KbCardTitle, KbCardDesc, KbStats, KbStat, KbStatNum, KbStatLabel, KbProgressBar, KbProgressFill, KbCount, KbForm, KbInput, KbCreateBtn, KbCancelBtn, KbMenuWrapper, KbMenuBtn, KbDropdown, KbDropdownItem, KbCardHeader, KbCardContent } from "./style";
import { DndContext, closestCenter, useDroppable, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function DraggableTask({ task, children }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes })}
    </div>
  );
}

function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return <KbCol ref={setNodeRef}>{children}</KbCol>;
}

export function Home() {

    const { tasks, setTasks, showForm, setShowForm, title, setTitle, desc, setDesc, addTask, deleteTask, editTask, startEdit, cancelEdit } = useTasks();

    const pending = tasks.filter(t => t.status === "pending");
    const progress = tasks.filter(t => t.status === "progress");
    const done = tasks.filter(t => t.status === "done");
    const [menuOpen, setMenuOpen] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

function handleDragEnd(event) {

  const { active, over } = event;

  if (!over) return;

  setTasks(prev => {

    const activeTask = prev.find(
      t => t.id === active.id
    );

    if (!activeTask) return prev;

    // soltou numa coluna
    if (
      over.id === "pending" ||
      over.id === "progress" ||
      over.id === "done"
    ) {

      return prev.map(task =>
        task.id === active.id
          ? { ...task, status: over.id }
          : task
      );
    }

    // soltou em cima de outro card
    const overTask = prev.find(
      t => t.id === over.id
    );

    if (!overTask) return prev;

    const oldIndex = prev.findIndex(
      t => t.id === active.id
    );

    const newIndex = prev.findIndex(
      t => t.id === over.id
    );

    const updated = [...prev];

    updated[oldIndex] = {
      ...updated[oldIndex],
      status: overTask.status
    };

    return arrayMove(updated, oldIndex, newIndex);
  });
}

return (
    <KbRoot>
      <KbHeader>
        <KbTitle>Gerenciador de tarefas</KbTitle>
        <HeaderActions>
          <KbBadge>{tasks.length} tarefas</KbBadge>
        </HeaderActions>
      </KbHeader>

      <KbStats>
        <KbStat>
          <KbStatNum>{pending.length}</KbStatNum>
          <KbStatLabel>Pendentes</KbStatLabel>
        </KbStat>

        <KbStat>
          <KbStatNum>{progress.length}</KbStatNum>
          <KbStatLabel>Em andamento</KbStatLabel>
        </KbStat>

        <KbStat>
          <KbStatNum>{done.length}</KbStatNum>
          <KbStatLabel>Concluídas</KbStatLabel>

          <KbProgressBar>
            <KbProgressFill
                $width={
                tasks.length
                    ? (done.length / tasks.length) * 100
                    : 0
                }
            />
          </KbProgressBar>
        </KbStat>
      </KbStats>

    <DndContext
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        const task = tasks.find(t => t.id === active.id);
        setActiveTask(task);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveTask(null);
      }}
      onDragCancel={() => {
        setActiveTask(null);
      }}
    >      

      <KbBoard>

        <DroppableColumn id="pending">

          <SortableContext items={pending.map(t => t.id)} strategy={verticalListSortingStrategy}>

          <KbColHeader>
            <KbDot $variant="pending" />
            <KbColLabel>Pendente</KbColLabel>

              <KbCount $variant="pending">{pending.length}</KbCount>
          </KbColHeader>

          {pending.map((t, i) => (
        <DraggableTask task={t} key={t.id}>
  {({ listeners, attributes }) => (
    <KbCard
    {...listeners}
    {...attributes}
    >
      <KbCardHeader>

        <KbCardContent>
          <KbCardTitle>{t.title}</KbCardTitle>
          <KbCardDesc>{t.desc}</KbCardDesc>
        </KbCardContent>

    <KbMenuWrapper
      onPointerDown={(e) => e.stopPropagation()}
    >
          <KbMenuBtn
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(menuOpen === t.id ? null : t.id);
            }}
          >
            ⋮
          </KbMenuBtn>

          {menuOpen === t.id && (
            <KbDropdown>
              <KbDropdownItem
                onClick={() => {
                  startEdit(t.id);
                  setMenuOpen(null);
                }}
              >
                Editar
              </KbDropdownItem>

              <KbDropdownItem $danger onClick={() => deleteTask(t.id)}>
                Excluir
              </KbDropdownItem>
            </KbDropdown>
          )}
        </KbMenuWrapper>

      </KbCardHeader>
    </KbCard>
  )}
</DraggableTask>
  ))}
    </SortableContext>

          {showForm === "pending" ? (
            <KbForm>
                <KbInput
                    maxLength={60}
                    placeholder="Título"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <KbInput
                    maxLength={200}
                    placeholder="Descrição"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />
                <KbCreateBtn onClick={() => addTask("pending")}>
                    Criar
                </KbCreateBtn>

                <KbCancelBtn onClick={cancelEdit}>
                    Cancelar
                </KbCancelBtn>

            </KbForm>
          ) : (
            <KbAddBtn onClick={() => setShowForm("pending")}>+ Criar</KbAddBtn>
          )}
        </DroppableColumn>

        <DroppableColumn id="progress">

          <SortableContext items={progress.map(t => t.id)} strategy={verticalListSortingStrategy}>
          
          <KbColHeader>
            <KbDot $variant="progress" />
            <KbColLabel>Em andamento</KbColLabel>

            <KbCount $variant="progress">{progress.length}</KbCount>
          </KbColHeader>

          {progress.map((t, i) => (
            <DraggableTask task={t} key={t.id}>
  {({ listeners, attributes }) => (
    <KbCard
      {...listeners}
      {...attributes}
    >
      <KbCardHeader>
        
        {/* 👇 AREA DE DRAG (só aqui arrasta) */}
        <KbCardContent>
          <KbCardTitle>{t.title}</KbCardTitle>
          <KbCardDesc>{t.desc}</KbCardDesc>
        </KbCardContent>

        {/* 👇 MENU (agora funciona normal) */}
        <KbMenuWrapper
          onPointerDown={(e) => e.stopPropagation()}
        >
          <KbMenuBtn
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(menuOpen === t.id ? null : t.id);
            }}
          >
            ⋮
          </KbMenuBtn>

          {menuOpen === t.id && (
            <KbDropdown>
              <KbDropdownItem
                onClick={() => {
                  startEdit(t.id);
                  setMenuOpen(null);
                }}
              >
                Editar
              </KbDropdownItem>

              <KbDropdownItem $danger onClick={() => deleteTask(t.id)}>
                Excluir
              </KbDropdownItem>
            </KbDropdown>
          )}
        </KbMenuWrapper>

      </KbCardHeader>
    </KbCard>
  )}
</DraggableTask>
  ))}
    </SortableContext>

          {showForm === "progress" ? (
             <KbForm>
                <KbInput
                    maxLength={60}
                    placeholder="Título"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <KbInput
                    maxLength={200}
                    placeholder="Descrição"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />
                <KbCreateBtn onClick={() => addTask("progress")}>
                    Criar
                </KbCreateBtn>

                <KbCancelBtn onClick={cancelEdit}>
                    Cancelar
                </KbCancelBtn>

            </KbForm>
          ) : (
            <KbAddBtn onClick={() => setShowForm("progress")}>+ Criar</KbAddBtn>
          )}
        </DroppableColumn>

        <DroppableColumn id="done">

          <SortableContext items={done.map(t => t.id)} strategy={verticalListSortingStrategy}>

          <KbColHeader>
            <KbDot $variant="done" />
            <KbColLabel>Concluída</KbColLabel>

            <KbCount $variant="done">{done.length}</KbCount>
          </KbColHeader>

          {done.map((t, i) => (
        <DraggableTask task={t} key={t.id}>
  {({ listeners, attributes }) => (
    <KbCard
      {...listeners}
      {...attributes}
    >
      <KbCardHeader>

        <KbCardContent>
          <KbCardTitle>{t.title}</KbCardTitle>
          <KbCardDesc>{t.desc}</KbCardDesc>
        </KbCardContent>

    <KbMenuWrapper
      onPointerDown={(e) => e.stopPropagation()}
    >
          <KbMenuBtn
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(menuOpen === t.id ? null : t.id);
            }}
          >
            ⋮
          </KbMenuBtn>

          {menuOpen === t.id && (
            <KbDropdown>
            <KbDropdownItem
              onClick={() => {
                startEdit(t.id);
                setMenuOpen(null);
              }}
            >
              Editar
            </KbDropdownItem>

              <KbDropdownItem $danger onClick={() => deleteTask(t.id)}>
                Excluir
              </KbDropdownItem>
            </KbDropdown>
          )}
        </KbMenuWrapper>

      </KbCardHeader>
    </KbCard>
  )}
</DraggableTask>
  ))}
    </SortableContext>

          {showForm === "done" ? (
             <KbForm>
                <KbInput
                    maxLength={60}
                    placeholder="Título"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <KbInput
                    maxLength={200}
                    placeholder="Descrição"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />
                <KbCreateBtn onClick={() => addTask("done")}>
                    Criar
                </KbCreateBtn>

                <KbCancelBtn onClick={cancelEdit}>
                    Cancelar
                </KbCancelBtn>
            </KbForm>
          ) : (
            <KbAddBtn onClick={() => setShowForm("done")}>+ Criar</KbAddBtn>
          )}
        </DroppableColumn>

      </KbBoard>

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
  );
}
import { useState } from "react"; 
import { useTasks } from "./useTasks";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

import { KbRoot, KbHeader, KbTitle, HeaderActions, KbAddBtn, KbBadge, KbBoard, KbCol, KbColHeader, KbDot, KbColLabel, KbCard, KbCardTitle, KbCardDesc, KbStats, KbStat, KbStatNum, KbStatLabel, KbProgressBar, KbProgressFill, KbCount, KbForm, KbInput, KbCreateBtn, KbCancelBtn, KbMenuWrapper, KbMenuBtn, KbDropdown, KbDropdownItem, KbCardHeader} from "./style";

function DraggableTask({ task, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
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

    const {tasks, showForm, setShowForm, title, setTitle, desc, setDesc, addTask, deleteTask, editTask, startEdit } = useTasks();

    const pending = tasks.filter(t => t.status === "pending");
    const progress = tasks.filter(t => t.status === "progress");
    const done = tasks.filter(t => t.status === "done");
    const [menuOpen, setMenuOpen] = useState(null);

    function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    editTask(active.id, over.id);
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

    <DndContext onDragEnd={handleDragEnd}>      

      <KbBoard>

        <DroppableColumn id="pending">
          <KbColHeader>
            <KbDot $variant="pending" />
            <KbColLabel>Pendente</KbColLabel>

              <KbCount $variant="pending">{pending.length}</KbCount>
          </KbColHeader>

          {pending.map((t, i) => (
        <DraggableTask task={t} key={t.id}>
  {({ listeners, attributes }) => (
    <KbCard>
      <KbCardHeader>
        
        <div {...listeners} {...attributes} style={{ cursor: "grab" }}>
          <KbCardTitle>{t.title}</KbCardTitle>
          <KbCardDesc>{t.desc}</KbCardDesc>
        </div>

        {/* 👇 MENU (agora funciona normal) */}
        <KbMenuWrapper>
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
              <KbDropdownItem onClick={() => startEdit(t.id)}>
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

          {showForm === "pending" ? (
            <KbForm>
                <KbInput
                    placeholder="Título"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <KbInput
                    placeholder="Descrição"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />
                <KbCreateBtn onClick={() => addTask("pending")}>
                    Criar
                </KbCreateBtn>

                <KbCancelBtn onClick={() => setShowForm(null)}>
                    Cancelar
                </KbCancelBtn>

            </KbForm>
          ) : (
            <KbAddBtn onClick={() => setShowForm("pending")}>+ Criar</KbAddBtn>
          )}
        </DroppableColumn>

        <DroppableColumn id="progress">
          <KbColHeader>
            <KbDot $variant="progress" />
            <KbColLabel>Em andamento</KbColLabel>

            <KbCount $variant="progress">{progress.length}</KbCount>
          </KbColHeader>

          {progress.map((t, i) => (
            <DraggableTask task={t} key={t.id}>
  {({ listeners, attributes }) => (
    <KbCard>
      <KbCardHeader>
        
        {/* 👇 AREA DE DRAG (só aqui arrasta) */}
        <div {...listeners} {...attributes} style={{ cursor: "grab" }}>
          <KbCardTitle>{t.title}</KbCardTitle>
          <KbCardDesc>{t.desc}</KbCardDesc>
        </div>

        {/* 👇 MENU (agora funciona normal) */}
        <KbMenuWrapper>
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
              <KbDropdownItem onClick={() => startEdit(t.id)}>
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

          {showForm === "progress" ? (
             <KbForm>
                <KbInput
                    placeholder="Título"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <KbInput
                    placeholder="Descrição"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />
                <KbCreateBtn onClick={() => addTask("progress")}>
                    Criar
                </KbCreateBtn>

                <KbCancelBtn onClick={() => setShowForm(null)}>
                    Cancelar
                </KbCancelBtn>

            </KbForm>
          ) : (
            <KbAddBtn onClick={() => setShowForm("progress")}>+ Criar</KbAddBtn>
          )}
        </DroppableColumn>

        <DroppableColumn id="done">
          <KbColHeader>
            <KbDot $variant="done" />
            <KbColLabel>Concluída</KbColLabel>

            <KbCount $variant="done">{done.length}</KbCount>
          </KbColHeader>

          {done.map((t, i) => (
        <DraggableTask task={t} key={t.id}>
  {({ listeners, attributes }) => (
    <KbCard>
      <KbCardHeader>
        
        {/* 👇 AREA DE DRAG (só aqui arrasta) */}
        <div {...listeners} {...attributes} style={{ cursor: "grab" }}>
          <KbCardTitle>{t.title}</KbCardTitle>
          <KbCardDesc>{t.desc}</KbCardDesc>
        </div>

        {/* 👇 MENU (agora funciona normal) */}
        <KbMenuWrapper>
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
              <KbDropdownItem onClick={() => startEdit(t.id)}>
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

          {showForm === "done" ? (
             <KbForm>
                <KbInput
                    placeholder="Título"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <KbInput
                    placeholder="Descrição"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />
                <KbCreateBtn onClick={() => addTask("done")}>
                    Criar
                </KbCreateBtn>

                <KbCancelBtn onClick={() => setShowForm(null)}>
                    Cancelar
                </KbCancelBtn>
            </KbForm>
          ) : (
            <KbAddBtn onClick={() => setShowForm("done")}>+ Criar</KbAddBtn>
          )}
        </DroppableColumn>

      </KbBoard>

      </DndContext>
    </KbRoot>
  );
}
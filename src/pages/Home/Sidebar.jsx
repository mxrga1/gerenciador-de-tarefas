import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

// ─── Estilos ──────────────────────────────────────────────────────────────────

const SidebarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
  z-index: 20;
`;

const SidebarPanel = styled.div`
  width: ${({ $open }) => ($open ? "220px" : "0px")};
  overflow: hidden;
  transition: width 0.25s ease;
  background: #f0efe9;
  border-right: ${({ $open }) => ($open ? "0.5px solid #e0dfd8" : "none")};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SidebarInner = styled.div`
  width: 220px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;

const SidebarTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 0 4px;
  margin-bottom: 4px;
  flex-shrink: 0;
`;

const BoardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#e4e3dc" : "transparent")};
  transition: background 0.15s;

  &:hover {
    background: ${({ $active }) => ($active ? "#e4e3dc" : "#e8e7e0")};
  }
`;

const BoardItem = styled.button`
  flex: 1;
  min-width: 0;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 7px 6px 7px 10px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "500" : "400")};
  color: ${({ $active }) => ($active ? "#1a1a18" : "#4b4b47")};
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoleTag = styled.span`
  font-size: 9px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  margin-left: 4px;
`;

const BoardMenuWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const BoardMenuBtn = styled.button`
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  line-height: 1;
  display: flex;
  align-items: center;

  &:hover {
    color: #1a1a18;
    background: rgba(0, 0, 0, 0.06);
  }
`;

const BoardDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 110%;
  background: #1f2937;
  border-radius: 6px;
  padding: 5px;
  min-width: 130px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  z-index: 30;
`;

const BoardDropdownItem = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: ${({ $danger }) => ($danger ? "#ef4444" : "#e5e7eb")};
  padding: 6px 8px;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  white-space: nowrap;

  &:hover {
    background: ${({ $danger }) =>
      $danger ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.1)"};
  }
`;

const AddBoardBtn = styled.button`
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px dashed #c8c7bf;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 13px;
  color: #9ca3af;
  cursor: pointer;
  margin-top: 4px;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    border-color: #9ca3af;
    color: #4b4b47;
    background: #e8e7e0;
  }
`;

const NewBoardForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
  flex-shrink: 0;
`;

const NewBoardInput = styled.input`
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid #c8c7bf;
  font-size: 13px;
  background: #fff;
  color: #1a1a18;
  outline: none;

  &:focus {
    border-color: #888;
  }
`;

const NewBoardConfirm = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: #222;
  color: #fff;
  font-size: 13px;
  cursor: pointer;

  &:hover { background: #000; }
  &:disabled { opacity: 0.6; cursor: default; }
`;

const NewBoardCancel = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: #ef4444;
  color: #fff;
  font-size: 13px;
  cursor: pointer;

  &:hover { background: #dc2626; }
`;

const InviteError = styled.div`
  font-size: 11px;
  color: #ef4444;
  padding: 0 2px;
`;

// Aba com seta — sempre visível, afastada 4px da borda do painel.
// Quando fechada, fica em left: 4px; o KbRoot reserva um padding-left
// extra (2.5rem) para que essa aba nunca fique sobre o título do board.
const ToggleTab = styled.button`
  position: absolute;
  left: ${({ $open }) => ($open ? "224px" : "4px")};
  top: 16px;
  transition: left 0.25s ease;

  width: 20px;
  height: 36px;
  background: #e4e3dc;
  border: 0.5px solid #e0dfd8;
  border-radius: 6px;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b6a66;
  font-size: 11px;
  padding: 0;
  z-index: 21;

  &:hover {
    background: #d8d7cf;
    color: #1a1a18;
  }
`;

// ─── Componente ───────────────────────────────────────────────────────────────

export function Sidebar({
  boards, activeBoardId, onSelectBoard, onAddBoard, onDeleteBoard, onRenameBoard,
  onInviteUser,
}) {
  const [open,          setOpen]          = useState(false);
  const [showNewForm,   setShowNewForm]    = useState(false);
  const [newTitle,      setNewTitle]       = useState("");
  const [boardMenuOpen, setBoardMenuOpen]  = useState(null);
  const [editingBoard,  setEditingBoard]   = useState(null); // { id, title }

  // Convite inline: { boardId, username, error, sending, sent }
  const [inviteState, setInviteState] = useState(null);

  // Fecha dropdown ao clicar fora
  const menuRef = useRef(null);
  useEffect(() => {
    if (!boardMenuOpen) return;
    function handle(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setBoardMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [boardMenuOpen]);

  function handleAdd() {
    if (!newTitle.trim()) return;
    onAddBoard(newTitle);
    setNewTitle("");
    setShowNewForm(false);
  }

  function handleRename() {
    if (!editingBoard?.title.trim()) return;
    onRenameBoard(editingBoard.id, editingBoard.title);
    setEditingBoard(null);
  }

  async function handleSendInvite() {
    if (!inviteState?.username.trim()) return;
    setInviteState((prev) => ({ ...prev, sending: true, error: null }));

    const { error } = await onInviteUser(inviteState.boardId, inviteState.username);

    if (error) {
      setInviteState((prev) => ({ ...prev, sending: false, error }));
      return;
    }
    setInviteState((prev) => ({ ...prev, sending: false, sent: true, username: "" }));
    setTimeout(() => setInviteState(null), 1400);
  }

  return (
    <SidebarWrapper>
      <SidebarPanel $open={open}>
        <SidebarInner>
          <SidebarTitle>Gerenciadores</SidebarTitle>

          {boards.map((board) => (
            <div key={board.id}>
              {/* Form de renomear inline */}
              {editingBoard?.id === board.id ? (
                <NewBoardForm>
                  <NewBoardInput
                    autoFocus
                    maxLength={40}
                    value={editingBoard.title}
                    onChange={(e) =>
                      setEditingBoard((prev) => ({ ...prev, title: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename();
                      if (e.key === "Escape") setEditingBoard(null);
                    }}
                  />
                  <NewBoardConfirm type="button" onClick={handleRename}>Salvar</NewBoardConfirm>
                  <NewBoardCancel type="button" onClick={() => setEditingBoard(null)}>Cancelar</NewBoardCancel>
                </NewBoardForm>
              ) : (
                <BoardRow $active={board.id === activeBoardId}>
                  <BoardItem
                    $active={board.id === activeBoardId}
                    onClick={() => onSelectBoard(board.id)}
                  >
                    {board.title}
                    {board.role === "owner" ? null : <RoleTag>convidado</RoleTag>}
                  </BoardItem>

                  <BoardMenuWrapper ref={boardMenuOpen === board.id ? menuRef : null}>
                    <BoardMenuBtn
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoardMenuOpen(boardMenuOpen === board.id ? null : board.id);
                      }}
                    >
                      ⋮
                    </BoardMenuBtn>

                    {boardMenuOpen === board.id && (
                      <BoardDropdown>
                        <BoardDropdownItem
                          onClick={() => {
                            setInviteState({ boardId: board.id, username: "", error: null, sending: false, sent: false });
                            setBoardMenuOpen(null);
                          }}
                        >
                          Convidar pessoa
                        </BoardDropdownItem>

                        {board.role === "owner" && (
                          <BoardDropdownItem
                            onClick={() => {
                              setEditingBoard({ id: board.id, title: board.title });
                              setBoardMenuOpen(null);
                            }}
                          >
                            Renomear
                          </BoardDropdownItem>
                        )}

                        {board.role === "owner" && board.id !== "board_default" && (
                          <BoardDropdownItem
                            $danger
                            onClick={() => {
                              onDeleteBoard(board.id);
                              setBoardMenuOpen(null);
                            }}
                          >
                            Excluir
                          </BoardDropdownItem>
                        )}
                      </BoardDropdown>
                    )}
                  </BoardMenuWrapper>
                </BoardRow>
              )}

              {/* Form de convite inline */}
              {inviteState?.boardId === board.id && (
                <NewBoardForm>
                  <NewBoardInput
                    autoFocus
                    maxLength={30}
                    placeholder="Nome de usuário"
                    value={inviteState.username}
                    onChange={(e) => setInviteState((prev) => ({ ...prev, username: e.target.value, error: null }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendInvite();
                      if (e.key === "Escape") setInviteState(null);
                    }}
                  />
                  {inviteState.error && <InviteError>{inviteState.error}</InviteError>}
                  <NewBoardConfirm type="button" disabled={inviteState.sending} onClick={handleSendInvite}>
                    {inviteState.sent ? "Convite enviado!" : inviteState.sending ? "Enviando..." : "Convidar"}
                  </NewBoardConfirm>
                  <NewBoardCancel type="button" onClick={() => setInviteState(null)}>Cancelar</NewBoardCancel>
                </NewBoardForm>
              )}
            </div>
          ))}

          {showNewForm ? (
            <NewBoardForm>
              <NewBoardInput
                autoFocus
                maxLength={40}
                placeholder="Nome do gerenciador"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") { setShowNewForm(false); setNewTitle(""); }
                }}
              />
              <NewBoardConfirm type="button" onClick={handleAdd}>Criar</NewBoardConfirm>
              <NewBoardCancel type="button" onClick={() => { setShowNewForm(false); setNewTitle(""); }}>Cancelar</NewBoardCancel>
            </NewBoardForm>
          ) : (
            <AddBoardBtn type="button" onClick={() => setShowNewForm(true)}>
              + Novo gerenciador
            </AddBoardBtn>
          )}
        </SidebarInner>
      </SidebarPanel>

      <ToggleTab $open={open} onClick={() => { setOpen((v) => !v); setShowNewForm(false); setBoardMenuOpen(null); }}>
        {open ? "‹" : "›"}
      </ToggleTab>
    </SidebarWrapper>
  );
}
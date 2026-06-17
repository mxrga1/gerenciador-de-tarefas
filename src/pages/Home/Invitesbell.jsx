import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

// ─── Estilos ──────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  position: relative;
`;

const BellBtn = styled.button`
  position: relative;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #4b4b47;
  transition: all 0.15s;

  &:hover {
    background: #f5f4ef;
    border-color: rgba(0, 0, 0, 0.3);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 110%;
  width: 280px;
  max-height: 360px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e0dfd8;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 50;
  padding: 6px;
`;

const DropdownTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b6a66;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 8px 6px;
`;

const EmptyState = styled.div`
  padding: 20px 12px;
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
`;

const InviteCard = styled.div`
  padding: 10px;
  border-radius: 8px;
  background: #f9f8f4;
  border: 1px solid #eeeee6;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InviteText = styled.div`
  font-size: 13px;
  color: #1a1a18;
  line-height: 1.45;
  margin-bottom: 8px;

  b {
    font-weight: 600;
  }
`;

const InviteActions = styled.div`
  display: flex;
  gap: 6px;
`;

const AcceptBtn = styled.button`
  flex: 1;
  padding: 6px;
  border: none;
  border-radius: 6px;
  background: #1a1a18;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover { background: #000; }
  &:disabled { opacity: 0.6; cursor: default; }
`;

const DeclineBtn = styled.button`
  flex: 1;
  padding: 6px;
  border: 1px solid #e0dfd8;
  border-radius: 6px;
  background: transparent;
  color: #4b4b47;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover { background: #f5f4ef; }
  &:disabled { opacity: 0.6; cursor: default; }
`;

// ─── Componente ───────────────────────────────────────────────────────────

export function InvitesBell({ invites, onAccept, onDecline }) {
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  async function handleAccept(id) {
    setBusyId(id);
    await onAccept(id);
    setBusyId(null);
    if (invites.length <= 1) setOpen(false);
  }

  async function handleDecline(id) {
    setBusyId(id);
    await onDecline(id);
    setBusyId(null);
  }

  return (
    <Wrapper ref={wrapperRef}>
      <BellBtn type="button" onClick={() => setOpen((v) => !v)} title="Convites">
        ✉
        {invites.length > 0 && <Badge>{invites.length}</Badge>}
      </BellBtn>

      {open && (
        <Dropdown>
          <DropdownTitle>Convites</DropdownTitle>

          {invites.length === 0 ? (
            <EmptyState>Nenhum convite pendente</EmptyState>
          ) : (
            invites.map((invite) => (
              <InviteCard key={invite.id}>
                <InviteText>
                  <b>{invite.inviterName}</b> te convidou para o quadro <b>{invite.boardTitle}</b>
                </InviteText>
                <InviteActions>
                  <AcceptBtn
                    type="button"
                    disabled={busyId === invite.id}
                    onClick={() => handleAccept(invite.id)}
                  >
                    Aceitar
                  </AcceptBtn>
                  <DeclineBtn
                    type="button"
                    disabled={busyId === invite.id}
                    onClick={() => handleDecline(invite.id)}
                  >
                    Recusar
                  </DeclineBtn>
                </InviteActions>
              </InviteCard>
            ))
          )}
        </Dropdown>
      )}
    </Wrapper>
  );
}
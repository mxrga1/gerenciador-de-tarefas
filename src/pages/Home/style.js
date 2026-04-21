import styled from "styled-components";

export const KbRoot = styled.div`
  --font-sans: "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "DM Mono", ui-monospace, SFMono-Regular, monospace;

  --color-text-primary: #1a1a18;
  --color-text-secondary: #6b6a66;
  --color-background-primary: #ffffff;
  --color-background-secondary: #f5f4ef;
  --color-border-tertiary: #e0dfd8;
  --color-border-secondary: #c8c7bf;

  --border-radius-lg: 12px;
  --border-radius-md: 8px;

  font-family: var(--font-sans);
  padding: 1.5rem 1rem 2rem;
  min-height: 520px;
`;

export const KbHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const KbCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

export const KbTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: -0.3px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const KbBadge = styled.span`
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--color-background-secondary);
  color: var(--color-text-secondary);
  border: 0.5px solid var(--color-border-tertiary);
`;

export const KbBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
`;

export const KbCol = styled.div`
  background: var(--color-background-secondary);
  border-radius: var(--border-radius-lg);
  border: 0.5px solid var(--color-border-tertiary);
  padding: 12px 10px;
  min-height: auto;
`;

export const KbColHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 0.5px solid var(--color-border-tertiary);
`;

export const KbDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $variant }) =>
    $variant === "pending"
      ? "#888780"
      : $variant === "progress"
      ? "#378ADD"
      : "#639922"};
`;

export const KbColLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  flex: 1;
`;

export const KbCount = styled.span`
  font-size: 11px;
  font-weight: 500;
  min-width: 10px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  background: ${({ $variant }) =>
    $variant === "pending"
      ? "#D3D1C7"
      : $variant === "progress"
      ? "#B5D4F4"
      : "#C0DD97"};
  color: ${({ $variant }) =>
    $variant === "pending"
      ? "#444441"
      : $variant === "progress"
      ? "#0C447C"
      : "#27500A"};
`;

export const KbCard = styled.div`
  background: var(--color-background-primary);
  border-radius: var(--border-radius-md);
  border: 0.5px solid var(--color-border-tertiary);
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: var(--color-border-secondary);
  }
`;

export const KbCardTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
  margin-bottom: 6px;
`;

export const KbCardDesc = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
`;

export const KbCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const KbTag = styled.span`
  font-size: 10px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 20px;
  background: ${({ $variant }) =>
    $variant === "blue"
      ? "#E6F1FB"
      : $variant === "amber"
      ? "#FAEEDA"
      : $variant === "green"
      ? "#EAF3DE"
      : "#F1EFE8"};
  color: ${({ $variant }) =>
    $variant === "blue"
      ? "#185FA5"
      : $variant === "amber"
      ? "#854F0B"
      : $variant === "green"
      ? "#3B6D11"
      : "#5F5E5A"};
`;

export const KbAddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 13px;
  background: transparent;
  border: 1px rgba(0,0,0,0.2);
  border-radius: 6px;
  cursor: pointer;
  color: #555;
  transition: all 0.2s;
  &:hover {
    background: rgba(0,0,0,0.05);
    border-color: rgba(0,0,0,0.4);
  }
`;

export const KbStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 1.25rem;
`;

export const KbStat = styled.div`
  background: var(--color-background-secondary);
  border-radius: var(--border-radius-md);
  padding: 10px 12px;
  border: 0.5px solid var(--color-border-tertiary);
`;

export const KbStatNum = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1;
`;

export const KbStatLabel = styled.div`
  font-size: 11px;
  color: var(--color-text-secondary);
  margin-top: 4px;
`;

export const KbProgressBar = styled.div`
  height: 3px;
  background: var(--color-border-tertiary);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`;

export const KbProgressFill = styled.div`
  height: 100%;
  border-radius: 2px;
  background: #639922;
  width: ${({ $width }) => $width}%;
`;

export const KbForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
`;

export const KbInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.15);
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

export const KbCreateBtn = styled.button`
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: #222;
  color: white;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #000;
  }
`;

export const KbCancelBtn = styled.button`
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: #ef4444; 
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #dc2626; 
  }
`;

export const KbMenuWrapper = styled.div`
  position: relative;
`;

export const KbMenuBtn = styled.button`
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: #111;
    background: rgba(0,0,0,0.05);
    border-radius: 4px;
  }
`;

export const KbDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 110%;
  background: #1f2937;
  border-radius: 6px;
  padding: 5px;
  min-width: 100px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
  z-index: 10;
`;

export const KbDropdownItem = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: ${({ $danger }) => ($danger ? "#ef4444" : "#e5e7eb")};
  padding: 6px;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;

  &:hover {
    background: ${({ $danger }) =>
      $danger ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.1)"};
  }
`;
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
  padding: 1.5rem 1rem 2rem 2.5rem;
  min-height: 98vh;
  box-sizing: border-box;
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
  flex-wrap: wrap;
`;

export const KbBoard = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  width: max-content;
`;

export const KbBoardWrapper = styled.div`
  width: 100%;

  overflow-x: auto;
  overflow-y: hidden;

  /* ocupa todo o espaço restante da tela */
  height: calc(100vh - 180px);

  display: flex;
  align-items: flex-start;

  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f4ef;
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c8c7bf;
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a9a79d;
  }
`;

export const KbTaskList = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f4ef;
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c8c7bf;
    border-radius: 999px;
  }
`;

export const KbCol = styled.div`
  background: var(--color-background-secondary);
  border-radius: var(--border-radius-lg);
  border: 0.5px solid var(--color-border-tertiary);
  padding: 12px 10px;

  width: 320px;
  min-width: 320px;

  display: flex;
  flex-direction: column;
  gap: 3px;

  flex-shrink: 0;

  max-height: calc(100vh - 250px);
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: #c8c7bf transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
  background: #c8c7bf;
  border-radius: 999px;
  transition: background 0.2s;
}

&::-webkit-scrollbar-thumb:hover {
  background: #8f8d84;
}

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
  background: ${({ $variant, $color }) =>
    $color
      ? $color
      : $variant === "pending"
      ? "#888780"
      : $variant === "progress"
      ? "#378ADD"
      : $variant === "done"
      ? "#639922"
      : "#9ca3af"};
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
  background: ${({ $variant, $color }) =>
    $color
      ? `${$color}30`   /* cor com 18% opacidade */
      : $variant === "pending"
      ? "#D3D1C7"
      : $variant === "progress"
      ? "#B5D4F4"
      : $variant === "done"
      ? "#C0DD97"
      : "#e5e7eb"};
  color: ${({ $variant, $color }) =>
    $color
      ? $color
      : $variant === "pending"
      ? "#444441"
      : $variant === "progress"
      ? "#0C447C"
      : $variant === "done"
      ? "#27500A"
      : "#374151"};
`;

export const KbCard = styled.div`
  background: var(--color-background-primary);
  border-radius: var(--border-radius-md);
  border: 0.5px solid var(--color-border-tertiary);
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: grab;
  transition: border-color 0.15s;
  touch-action: none;

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

  word-break: break-word;
  overflow-wrap: break-word;
`;

export const KbCardDesc = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;

  word-break: break-word;
  overflow-wrap: break-word;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  cursor: pointer;
  color: #555;
  transition: all 0.2s;
  width: fit-content;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.4);
  }
`;

export const KbStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  border: 1px solid rgba(0, 0, 0, 0.15);
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
  margin-top: -10px;
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
    background: rgba(0, 0, 0, 0.05);
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
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

export const KbCardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const KbCardFooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 2px;
`;

export const KbAddColumn = styled.button`
  width: 320px;
  min-width: 320px;
  height: 52px;

  background: var(--color-background-secondary);
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 0 16px;

  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;

  cursor: pointer;
  flex-shrink: 0;

  transition: all 0.15s ease;

  &:hover {
    border-color: var(--color-border-secondary);
    background: #efeee8;
    color: var(--color-text-primary);
  }
`;

export const KbPortalDropdown = styled.div`
  position: fixed;
  background: #1f2937;
  border-radius: 6px;
  padding: 5px;
  min-width: 100px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;
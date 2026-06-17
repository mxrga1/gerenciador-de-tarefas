import styled from "styled-components";

const PALETTE = [
  "#378ADD", "#639922", "#8B5CF6", "#F59E0B",
  "#EC4899", "#EF4444", "#14B8A6", "#6366F1",
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getColorForName(name) {
  if (!name) return "#9ca3af";
  return PALETTE[hashString(name) % PALETTE.length];
}

const AvatarCircle = styled.div`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  min-width: ${({ $size }) => $size}px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => Math.max(9, $size * 0.42)}px;
  font-weight: 600;
  color: #fff;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  user-select: none;
`;

export function Avatar({ name, size = 20, title }) {
  return (
    <AvatarCircle
      $size={size}
      $color={getColorForName(name)}
      title={title ?? name ?? "Desconhecido"}
    >
      {getInitials(name)}
    </AvatarCircle>
  );
}
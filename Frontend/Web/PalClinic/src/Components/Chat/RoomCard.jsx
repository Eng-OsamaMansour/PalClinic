import React from "react";
import { Theme } from "../../assets/Theme/Theme1";

export default function RoomCard({ room, selected, onClick }) {
  const S = {
    box: {
      padding: Theme.spacing.small,
      borderRadius: Theme.borderRadius.medium,
      background: selected ? Theme.accent : Theme.cardBackground,
      color: selected ? Theme.textInverse : Theme.textPrimary,
      cursor: "pointer",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  };

  return (
    <div style={S.box} onClick={onClick} title={room.title || room.name}>
      {room.title || room.name}
    </div>
  );
}

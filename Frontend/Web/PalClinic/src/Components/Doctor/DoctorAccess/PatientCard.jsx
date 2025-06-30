import React, { useState } from "react";
import { MdPersonAddAlt } from "react-icons/md";
import { Theme } from "../../../assets/Theme/Theme1";

export default function PatientCard({ patient, onSend }) {
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (busy) return;
    setBusy(true);
    await onSend(patient.id);
    setBusy(false);
  };

  return (
    <div style={S.card}>
      <h4 style={S.name}>{patient.name}</h4>
      <p style={S.row}>{patient.email}</p>
      <p style={S.row}>{patient.phoneNumber}</p>

      <button style={S.btn} onClick={send} disabled={busy}>
        <MdPersonAddAlt size={20} /> {busy ? "..." : "طلب وصول"}
      </button>
    </div>
  );
}


const S = {
  card: {
    background: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.medium,
    boxShadow: "0 6px 14px rgba(0,0,0,.06)",
    lineHeight: 1.7,
    display: "flex",
    flexDirection: "column",
    gap: Theme.spacing.tiny,
  },
  name: { margin: 0, fontSize: Theme.fontSize.heading },
  row: { margin: 0, fontSize: Theme.fontSize.tiny, color: Theme.textSecondary },
  btn: {
    marginTop: Theme.spacing.small,
    padding: Theme.spacing.tiny,
    border: "none",
    borderRadius: 6,
    background: Theme.accent,
    color: Theme.textInverse,
    display: "flex",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
  },
};

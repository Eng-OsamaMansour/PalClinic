import React from "react";
import { MdPerson, MdSchedule, MdCheck, MdClose } from "react-icons/md";
import { Theme } from "../../../assets/Theme/Theme1";

const statusColor = {
  accepted: Theme.success,
  rejected: Theme.danger,
  pending:  Theme.warning,
};

export default function RequestCard({ req }) {
  return (
    <div style={S.card}>
      <header style={S.hdr}>
        <MdPerson size={22} />
        <span>{req.patient.name}</span>
      </header>

      <p style={S.email}>{req.patient.email}</p>

      <footer style={S.ftr}>
        <MdSchedule size={18} />
        {new Date(req.created_at).toLocaleDateString("ar-EG")}
        <span
          style={{ ...S.status, backgroundColor: statusColor[req.status] }}
        >
          {req.status === "accepted"
            ? "مقبول"
            : req.status === "rejected"
            ? "مرفوض"
            : "قيد الانتظار"}
        </span>
      </footer>
    </div>
  );
}

/* ───── styles ───── */
const S = {
  card: {
    background: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.medium,
    boxShadow: "0 6px 14px rgba(0,0,0,.06)",
    display: "flex",
    flexDirection: "column",
    gap: Theme.spacing.tiny,
    lineHeight: 1.6,
  },
  hdr: { display: "flex", alignItems: "center", gap: 6, fontWeight: 600 },
  email: { margin: 0, fontSize: Theme.fontSize.tiny, color: Theme.textSecondary },
  ftr: {
    marginTop: Theme.spacing.tiny,
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: Theme.fontSize.tiny,
  },
  status: {
    flexGrow: 1,
    textAlign: "center",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: 4,
    fontWeight: 600,
  },
};


import React from "react";
import { MdPersonOutline, MdCalendarToday, MdAccessTime } from "react-icons/md";
import { Theme } from "../../../../assets/Theme/Theme1";

export default function DoctorNoteCard({ note }) {
  return (
    <div style={S.card}>
      <header style={S.header}>
        <h4 style={S.title}>{note.title || "ملاحظة بدون عنوان"}</h4>
      </header>

      <section style={S.body}>
        <p style={S.text}>{note.note}</p>
      </section>

      <footer style={S.footer}>
        <span style={S.meta}>
          <MdPersonOutline size={18} /> {note.doctor.name}
        </span>
        <span style={S.meta}>
          <MdCalendarToday size={18} />
          {new Date(note.created_at).toLocaleDateString("ar-EG")}
        </span>
        <span style={S.meta}>
          <MdAccessTime size={18} />
          {new Date(note.created_at).toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </footer>
    </div>
  );
}

const S = {
  card: {
    background: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    boxShadow: "0 8px 20px rgba(0,0,0,.07)",
    padding: Theme.spacing.medium,
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.7,
  },
  header: { marginBottom: Theme.spacing.small },
  title: {
    margin: 0,
    fontSize: Theme.fontSize.heading,
    color: Theme.textPrimary,
  },
  body: { flexGrow: 1 },
  text: { margin: 0, whiteSpace: "pre-wrap" },
  footer: {
    marginTop: Theme.spacing.small,
    display: "flex",
    flexWrap: "wrap",
    gap: Theme.spacing.small,
    fontSize: Theme.fontSize.tiny,
    color: Theme.textSecondary,
  },
  meta: { display: "flex", alignItems: "center", gap: 4 },
};

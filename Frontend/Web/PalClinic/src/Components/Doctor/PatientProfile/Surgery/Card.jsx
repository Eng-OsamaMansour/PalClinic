import React from "react";
import {
  MdLocalHospital,
  MdPerson,
  MdPictureAsPdf,
  MdAccessTime,
} from "react-icons/md";
import { Theme } from "../../../../assets/Theme/Theme1";

export default function SurgeryCard({ data }) {
  const d = new Date(data.surgery_date).toLocaleDateString("ar-EG");

  return (
    <div style={S.card}>
      <header style={S.head}>
        <h5 style={S.title}>
          <MdLocalHospital />
          &nbsp;{data.surgery_type}
        </h5>
        <span style={S.date}>
          <MdAccessTime />
          &nbsp;{d}
        </span>
      </header>

      <div style={S.doc}>
        <MdPerson />
        &nbsp;{data.doctor.name}
      </div>

      <p style={S.desc}>{data.description}</p>

      <a href={data.report} target="_blank" rel="noreferrer" style={S.btn}>
        <MdPictureAsPdf />
        &nbsp;عرض التقرير
      </a>
    </div>
  );
}

const S = {
  card: {
    direction: "rtl",
    background: Theme.cardBackground,
    borderRadius: 16,
    padding: Theme.spacing.medium,
    boxShadow: "0 4px 12px rgba(0,0,0,.06)",
    fontSize: 14,
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    background: Theme.primaryLight,
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  title: { margin: 0, fontSize: 16, color: Theme.textPrimary },
  doc: { color: Theme.textSecondary, marginBottom: 6 },
  desc: { margin: "6px 0 12px", lineHeight: 1.6 },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: Theme.accent,
    color: Theme.textInverse,
    padding: "4px 14px",
    borderRadius: 8,
    fontSize: 13,
    textDecoration: "none",
  },
};

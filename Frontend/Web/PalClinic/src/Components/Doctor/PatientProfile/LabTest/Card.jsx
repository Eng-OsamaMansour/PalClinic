
import React from "react";
import {
  MdScience,
  MdPerson,
  MdAccessTime,
  MdPictureAsPdf,
} from "react-icons/md";
import { Theme } from "../../../../assets/Theme/Theme1";

export default function LabTestCard({ data }) {
  const date = new Date(data.date).toLocaleDateString("ar-EG");

  return (
    <div style={S.card}>
      <header style={S.head}>
        <span style={S.date}>
          <MdAccessTime />&nbsp;{date}
        </span>
        <h5 style={S.title}>
          <MdScience />&nbsp;{data.name}
        </h5>
      </header>

      {data.doctor && (
        <div style={S.doc}>
          <MdPerson />&nbsp;{data.doctor.name}
        </div>
      )}

      <p style={S.desc}>{data.description}</p>

      {data.results && (
        <a
          href={data.results}
          target="_blank"
          rel="noreferrer"
          style={S.btn}
        >
          <MdPictureAsPdf />&nbsp;عرض النتيجة
        </a>
      )}
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
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  doc: { color: Theme.textSecondary },
  desc: { lineHeight: 1.6 },
  btn: {
    marginTop: "auto",
    alignSelf: "flex-start",
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

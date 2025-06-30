import React from "react";
import {
  MdVerified,
  MdCancel,
  MdPerson,
  MdInfo,
  MdMoreTime,
} from "react-icons/md";
import { Theme } from "../../../../assets/Theme/Theme1";

export default function TreatmentCard({ data }) {
  const start = new Date(data.start_date).toLocaleDateString("ar-EG");
  const end = data.end_date
    ? new Date(data.end_date).toLocaleDateString("ar-EG")
    : "—";

  return (
    <div style={S.card}>
      <header style={S.head}>
        <span style={data.active ? S.okDot : S.noDot}>
          {data.active ? <MdVerified /> : <MdCancel />}
        </span>
        <h5 style={S.title}>
          {data.treatment} <small style={S.dose}>{data.dosage}</small>
        </h5>
      </header>

      <div style={S.row}>
        <MdPerson />
        &nbsp;{data.doctor?.name ?? "—"}
      </div>

      <div style={S.row}>
        <MdMoreTime />
        &nbsp;
        {`من ${start} إلى ${end}`}
      </div>

      <p style={S.desc}>
        <MdInfo />
        &nbsp;{data.description}
      </p>
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
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 14,
  },
  head: { display: "flex", gap: 6, alignItems: "center" },
  okDot: { color: "#15c36f", fontSize: 22 },
  noDot: { color: "#c3c3c3", fontSize: 22 },
  title: { margin: 0, fontSize: 16, color: Theme.textPrimary },
  dose: { fontWeight: 400, fontSize: 12, color: Theme.textSecondary },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: Theme.textSecondary,
  },
  desc: { lineHeight: 1.6, marginTop: 4 },
};

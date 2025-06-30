import React from "react";
import { Theme } from "../../../assets/Theme/Theme1";

const statusMeta = {
  pending:   { color: Theme.warning, label: "قيد الانتظار" },
  completed: { color: Theme.success, label: "مكتمل" },
  canceled:  { color: Theme.danger,  label: "ملغي" },
};

export default function AppointmentCard({ booking }) {
  const { appointment: a, patient_info: p } = booking;

  const meta  = statusMeta[a.status] ?? statusMeta.pending;
  const dateA = new Date(a.date).toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeA = a.time.slice(0, 5); // HH:mm

  return (
    <div style={S.card}>
      {/* patient name header */}
      <h4 style={S.h}>{p.name}</h4>

      {/* Appointment details */}
      <section style={S.section}>
        <h5 style={S.title}>بيانات الحجز</h5>
        <Row lbl="رقم الحجز" val={a.id} />
        <Row lbl="التاريخ"    val={dateA} />
        <Row lbl="الوقت"      val={timeA} />
        <Row lbl="العيادة"    val={a.clinic_name} />
        <div style={S.row}>
          <strong>الحالة:</strong>&nbsp;
          <span style={{ ...S.pill, background: meta.color }}>{meta.label}</span>
        </div>
      </section>

      {/* Patient info */}
      <section style={S.section}>
        <h5 style={S.title}>بيانات المريض</h5>
        <Row lbl="البريد"  val={p.email} />
        <Row lbl="الهاتف" val={p.phoneNumber} />
      </section>
    </div>
  );
}

const Row = ({ lbl, val }) => (
  <div style={S.row}>
    <strong>{lbl}:</strong>&nbsp;{val}
  </div>
);

/* ───────── styles ───────── */
const S = {
  card: {
    direction: "rtl",
    background: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.medium,
    boxShadow: "0 8px 18px rgba(0,0,0,.08)",
    fontSize: 15,
  },
  h: { margin: 0, marginBottom: 6, color: Theme.textPrimary },
  title: {
    margin: "0 0 4px",
    fontSize: 14,
    color: Theme.textSecondary,
    fontWeight: Theme.fontWeight.bold,
  },
  section: {
    paddingTop: 6,
    borderTop: `1px solid ${Theme.border}`,
    "&:first-of-type": { borderTop: "none" },
  },
  row: { marginBottom: 4, lineHeight: 1.55 },
  pill: {
    display: "inline-block",
    padding: "2px 12px",
    borderRadius: 14,
    fontSize: 13,
    color: Theme.textInverse,
  },
};

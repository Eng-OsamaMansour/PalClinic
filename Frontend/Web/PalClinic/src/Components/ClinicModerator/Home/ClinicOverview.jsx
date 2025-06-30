import React from "react";
import { Theme } from "../../../assets/Theme/Theme1";

const days = [
  { key: "mon", label: "الإثنين" },
  { key: "tue", label: "الثلاثاء" },
  { key: "wed", label: "الأربعاء" },
  { key: "thu", label: "الخميس" },
  { key: "fri", label: "الجمعة" },
  { key: "sat", label: "السبت" },
  { key: "sun", label: "الأحد" },
];

export default function ClinicOverview({ clinic, onEdit }) {
  const row = { marginBottom: 4, lineHeight: 1.55 };

  const hours = clinic.operating_hours
    ? days
        .map(({ key, label }) => {
          const d = clinic.operating_hours[key];
          if (!d) return null;
          if (d.closed) return `${label}: مغلق`;
          if (d.open && d.close) return `${label}: ${d.open}-${d.close}`;
          return null;
        })
        .filter(Boolean)
        .join(" | ")
    : "غير متوفر";

  return (
    <div style={styles.card}>
      <h3 style={{ margin: "0 0 8px", color: Theme.textPrimary }}>
        {clinic.name}
      </h3>

      <div style={row}>
        <strong>النوع:</strong>&nbsp;{clinic.clinictype}
      </div>
      <div style={row}>
        <strong>العنوان:</strong>&nbsp;{clinic.address}
      </div>
      <div style={row}>
        <strong>الهاتف:</strong>&nbsp;{clinic.phoneNumber}
      </div>
      <div style={row}>
        <strong>البريد:</strong>&nbsp;{clinic.email}
      </div>
      <div style={row}>
        <strong>التخصصات:</strong>&nbsp;{clinic.specialties}
      </div>
      <div style={row}>
        <strong>ساعات العمل:</strong>&nbsp;{hours}
      </div>

      <button style={styles.btn} onClick={onEdit}>
        تعديل البيانات
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.large,
    boxShadow: "0 8px 22px rgba(0,0,0,.12)",
    maxWidth: 720,
    margin: "0 auto",
    direction: "rtl",
  },
  btn: {
    marginTop: Theme.spacing.medium,
    width: "100%",
    padding: Theme.spacing.small,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textInverse,
    background: Theme.accent,
    border: "none",
    borderRadius: Theme.borderRadius.medium,
    cursor: "pointer",
  },
};

import React from "react";
import { Theme } from "../../../assets/Theme/Theme1";
export default function ClinicCard({ clinic, onDeactivate, onEdit }) {
  const box = {
    background: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.medium,
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
    width: "100%",
    maxWidth: 500,
    margin: "0 auto",
    lineHeight: 1.55,
  };
  const row = { marginBottom: 6, fontSize: Theme.fontSize.small };
  const btn = {
    flex: 1,
    border: "none",
    borderRadius: 6,
    padding: "6px 0",
    cursor: "pointer",
    fontWeight: 500,
  };

  const hours = clinic.operating_hours
    ? Object.entries(clinic.operating_hours)
        .map(([day, span]) => `${day}: ${span}`)
        .join(" | ")
    : "غير محدد";

  return (
    <div style={box}>
      <h4 style={{ margin: "0 0 6px", color: Theme.textPrimary }}>
        {clinic.name}
      </h4>

      <div style={row}>
        <strong>النوع:</strong> {clinic.clinictype}
      </div>
      <div style={row}>
        <strong>العنوان:</strong> {clinic.address}
      </div>
      <div style={row}>
        <strong>الهاتف:</strong> {clinic.phoneNumber}
      </div>
      <div style={row}>
        <strong>البريد:</strong> {clinic.email}
      </div>
      <div style={row}>
        <strong>التخصصات:</strong> {clinic.specialties}
      </div>
      <div style={row}>
        <strong>ساعات العمل:</strong> {hours}
      </div>

      <div
        style={{
          display: "flex",
          gap: Theme.spacing.tiny,
          marginTop: Theme.spacing.small,
        }}
      >
        <button style={{ ...btn, background: Theme.accent, color: Theme.textInverse }}
                onClick={() => onEdit?.(clinic)}>
          تحديث
        </button>
        <button style={{ ...btn, background: Theme.danger, color: Theme.textInverse }}
                onClick={() => onDeactivate?.(clinic)}>
          تعطيل
        </button>
      </div>
    </div>
  );
}

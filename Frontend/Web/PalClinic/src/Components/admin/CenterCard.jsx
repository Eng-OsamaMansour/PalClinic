import React from "react";
import { Theme } from "../../assets/Theme/Theme1";

export default function CenterCard({ center, onDeactivate, onEdit }) {
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

  return (
    <div style={box}>
      <h4 style={{ margin: "0 0 6px", color: Theme.textPrimary }}>{center.name}</h4>

      <div style={row}><strong>النوع:</strong> {center.centerType}</div>
      <div style={row}><strong>العنوان:</strong> {center.address}</div>
      <div style={row}><strong>الهاتف:</strong> {center.phoneNumber}</div>
      <div style={row}><strong>البريد:</strong> {center.email}</div>
      <div style={row}><strong>الوصف:</strong> {center.discrption}</div>

      <div style={{ display: "flex", gap: Theme.spacing.tiny, marginTop: Theme.spacing.small }}>
        <button style={styles.primary} onClick={() => onEdit(center)}>
          تحديث
        </button>
        <button style={styles.danger} onClick={() => onDeactivate(center)}>
          تعطيل
        </button>
      </div>
    </div>
  );
}

const btn = {
  flex: 1,
  border: "none",
  borderRadius: 6,
  padding: "6px 0",
  cursor: "pointer",
  fontWeight: 500,
};

const styles = {
  primary: { ...btn, background: Theme.accent, color: Theme.textInverse },
  danger:  { ...btn, background: Theme.danger, color: Theme.textInverse },
};

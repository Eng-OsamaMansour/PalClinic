import React, { useState } from "react";
import { Theme } from "../../../../assets/Theme/Theme1";

export default function SurgeryForm({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    surgery_type: "",
    description: "",
    surgery_date: "",
    report: null,
  });
  if (!open) return null;

  const L = ({ children }) => <label style={F.lab}>{children}</label>;

  return (
    <div style={F.ov} onClick={onClose}>
      <form
        style={F.card}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          const body = new FormData();
          Object.entries(form).forEach(([k, v]) => body.append(k, v));
          onSave(body);
        }}
      >
        <h4 style={{ textAlign: "center" }}>إضافة عملية جراحية</h4>

        <L>نوع العملية</L>
        <input
          required
          value={form.surgery_type}
          onChange={(e) => setForm({ ...form, surgery_type: e.target.value })}
          style={F.inp}
        />

        <L>الوصف</L>
        <textarea
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ ...F.inp, minHeight: 80 }}
        />

        <L>تاريخ العملية</L>
        <input
          required
          type="date"
          value={form.surgery_date}
          onChange={(e) => setForm({ ...form, surgery_date: e.target.value })}
          style={F.inp}
        />

        <L>ملف التقرير (PDF)</L>
        <input
          required
          type="file"
          accept="application/pdf"
          onChange={(e) => setForm({ ...form, report: e.target.files[0] })}
          style={F.inp}
        />

        <button style={F.save}>حفظ</button>
        <button type="button" style={F.cancel} onClick={onClose}>
          إلغاء
        </button>
      </form>
    </div>
  );
}

const F = {
  ov: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    direction: "rtl",
  },
  card: {
    background: Theme.background,
    padding: 24,
    borderRadius: 16,
    width: 340,
  },
  lab: { fontSize: 14, marginBottom: 4 },
  inp: {
    width: "100%",
    marginBottom: Theme.spacing.small,
    padding: 8,
    border: `1px solid ${Theme.border}`,
    borderRadius: 6,
    direction: "rtl",
  },
  save: {
    width: "100%",
    padding: 8,
    background: Theme.accent,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  cancel: {
    width: "100%",
    padding: 8,
    background: Theme.disabled,
    color: Theme.textPrimary,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 6,
  },
};

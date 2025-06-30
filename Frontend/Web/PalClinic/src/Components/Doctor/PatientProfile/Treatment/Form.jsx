import React, { useState } from "react";
import { Theme } from "../../../../assets/Theme/Theme1";

export default function TreatmentForm({ open, onClose, onSave }) {
  const [form, set] = useState({
    treatment: "",
    dosage: "",
    description: "",
    start_date: "",
    end_date: "",
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
          onSave(form);
        }}
      >
        <h4 style={{ textAlign: "center" }}>إضافة وصفة طبية</h4>

        <L>الدواء</L>
        <input
          required
          value={form.treatment}
          onChange={(e) => set({ ...form, treatment: e.target.value })}
          style={F.inp}
        />

        <L>الجرعة</L>
        <input
          required
          value={form.dosage}
          onChange={(e) => set({ ...form, dosage: e.target.value })}
          style={F.inp}
        />

        <L>من تاريخ</L>
        <input
          type="date"
          required
          value={form.start_date}
          onChange={(e) => set({ ...form, start_date: e.target.value })}
          style={F.inp}
        />

        <L>إلى تاريخ</L>
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => set({ ...form, end_date: e.target.value })}
          style={F.inp}
        />

        <L>الوصف</L>
        <textarea
          required
          value={form.description}
          onChange={(e) => set({ ...form, description: e.target.value })}
          style={{ ...F.inp, minHeight: 80 }}
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

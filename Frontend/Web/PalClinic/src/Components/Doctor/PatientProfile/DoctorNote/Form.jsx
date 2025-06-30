import React, { useState, useEffect } from "react";
import { Theme } from "../../../../assets/Theme/Theme1";
import { postDoctorNote } from "../../../../API/MedicalProfile";
import { toast } from "react-toastify";

export default function DoctorNoteForm({ open, onClose, patientId, onAdded }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  /* reset when reopened */
  useEffect(() => {
    if (open) {
      setTitle("");
      setNote("");
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return toast.error("الملاحظة فارغة");
    setSaving(true);
    try {
      await postDoctorNote(patientId, { title, note });
      toast.success("تمت إضافة الملاحظة");
      onAdded(); 
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <form style={S.card} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3 style={S.h3}>إضافة ملاحظة</h3>

        <label style={S.label}>العنوان</label>
        <input
          style={S.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان اختياري"
        />

        <label style={S.label}>الملاحظة</label>
        <textarea
          style={{ ...S.input, minHeight: 120, resize: "vertical" }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />

        <button style={S.btn} disabled={saving}>
          {saving ? "يتم الحفظ..." : "حفظ"}
        </button>
      </form>
    </div>
  );
}

/* ───────── styles ───────── */
const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  card: {
    width: 420,
    maxWidth: "90%",
    background: Theme.background,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.large,
    boxShadow: "0 12px 28px rgba(0,0,0,.25)",
    display: "flex",
    flexDirection: "column",
    gap: Theme.spacing.small,
  },
  h3: { margin: "0 0 6px", textAlign: "center" },
  label: { fontSize: 14, fontWeight: 600 },
  input: {
    padding: Theme.spacing.small,
    border: `1px solid ${Theme.border}`,
    borderRadius: Theme.borderRadius.medium,
  },
  btn: {
    marginTop: Theme.spacing.medium,
    padding: Theme.spacing.small,
    background: Theme.accent,
    color: Theme.textInverse,
    border: "none",
    borderRadius: Theme.borderRadius.medium,
    cursor: "pointer",
  },
};

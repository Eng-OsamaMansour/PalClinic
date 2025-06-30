import React, { useState, useEffect } from "react";
import { Theme } from "../../../assets/Theme/Theme1";

const empty = {
  centerType: "Goverment",
  address: "",
  location: { latitude: "", longitude: "" },
  phoneNumber: "",
  email: "",
  discrption: "",
};

export default function EditModal({ open, center, onClose, onSave }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(center ?? empty);
  }, [center]);

  if (!open || !center) return null;

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  };

  const card = {
    background: Theme.background,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.large,
    width: 460,
    maxWidth: "90%",
    boxShadow: "0 12px 28px rgba(0,0,0,.25)",
  };

  const label = { fontSize: 14, marginBottom: 4, fontWeight: 500 };
  const input = {
    width: "100%",
    marginBottom: Theme.spacing.small,
    padding: Theme.spacing.tiny,
    border: `1px solid ${Theme.border}`,
    borderRadius: 6,
  };

  return (
    <div style={overlay} onClick={onClose}>
      <form
        style={card}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <h3 style={{ textAlign: "center", marginTop: 0 }}>
          تحديث بيانات المركز
        </h3>

        <label style={label}>النوع</label>
        <select
          style={input}
          value={form.centerType}
          onChange={update("centerType")}
        >
          <option value="Goverment">حكومي</option>
          <option value="Pricvate">خاص</option>
          <option value="None-Profit">غير ربحي</option>
        </select>

        <label style={label}>العنوان</label>
        <input
          style={input}
          value={form.address}
          onChange={update("address")}
        />

        <label style={label}>خط العرض (lat)</label>
        <input
          style={input}
          type="number"
          value={form.location?.latitude ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              location: { ...form.location, latitude: e.target.value },
            })
          }
        />

        <label style={label}>خط الطول (lon)</label>
        <input
          style={input}
          type="number"
          value={form.location?.longitude ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              location: { ...form.location, longitude: e.target.value },
            })
          }
        />

        <label style={label}>الهاتف</label>
        <input
          style={input}
          value={form.phoneNumber}
          onChange={update("phoneNumber")}
        />

        <label style={label}>البريد الإلكتروني</label>
        <input style={input} value={form.email} onChange={update("email")} />

        <label style={label}>الوصف</label>
        <textarea
          style={{ ...input, minHeight: 70 }}
          value={form.discrption}
          onChange={update("discrption")}
        />

        <button style={styles.save}>حفظ</button>
        <button type="button" style={styles.cancel} onClick={onClose}>
          إلغاء
        </button>
      </form>
    </div>
  );
}

const btnCommon = {
  width: "100%",
  border: "none",
  borderRadius: 6,
  padding: "6px 0",
  cursor: "pointer",
  marginBottom: 6,
  fontWeight: 500,
};

const styles = {
  save: { ...btnCommon, background: Theme.accent, color: Theme.textInverse },
  cancel: {
    ...btnCommon,
    background: Theme.disabled,
    color: Theme.textPrimary,
  },
};

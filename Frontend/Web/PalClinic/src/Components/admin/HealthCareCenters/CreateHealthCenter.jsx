import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createHealthCenter } from "../../../API/HealthCareCenters/HealthCenters";
import { Theme } from "../../../assets/Theme/Theme1";
import MapPicker from "../../general/MapPicker";

const initial = {
  name: "",
  centerType: "Goverment",
  address: "",
  latitude: "",
  longitude: "",
  phoneNumber: "",
  email: "",
  discrption: "",
};

export default function CreateHealthCenter() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  /* callback from MapPicker */
  const handlePick = ({ lat, lng }) =>
    setForm((f) => ({
      ...f,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      location: `POINT(${form.longitude} ${form.latitude})`,
    };
    try {
      await createHealthCenter(payload);
      toast.success("تم إنشاء المركز الصحي بنجاح ✔");
      setForm(initial);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ————————————————————————————————  styles */
  const S = {
    card: {
      maxWidth: 640,
      margin: "0 auto",
      background: Theme.cardBackground,
      borderRadius: Theme.borderRadius.large,
      padding: Theme.spacing.large,
      boxShadow: `0 10px 25px ${Theme.shadow}`,
      fontSize: Theme.fontSize.normal,
    },
    row: {
      display: "flex",
      gap: Theme.spacing.small,
      marginBottom: Theme.spacing.medium,
    },
    col: { flex: 1, display: "flex", flexDirection: "column" },
    label: { marginBottom: 4, fontWeight: Theme.fontWeight.medium },
    input: {
      padding: Theme.spacing.small,
      border: `1px solid ${Theme.border}`,
      borderRadius: Theme.borderRadius.medium,
      outline: "none",
    },
    select: {
      padding: Theme.spacing.small,
      border: `1px solid ${Theme.border}`,
      borderRadius: Theme.borderRadius.medium,
    },
    textarea: {
      minHeight: 80,
      resize: "vertical",
      padding: Theme.spacing.small,
      border: `1px solid ${Theme.border}`,
      borderRadius: Theme.borderRadius.medium,
    },
    submit: {
      marginTop: Theme.spacing.medium,
      width: "100%",
      padding: Theme.spacing.small,
      fontWeight: Theme.fontWeight.bold,
      color: Theme.textInverse,
      background: Theme.accent,
      border: "none",
      borderRadius: Theme.borderRadius.medium,
      cursor: "pointer",
      opacity: loading ? 0.6 : 1,
    },
  };

  /* ————————————————————————————————  UI */
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        rtl
      />
      <form style={S.card} onSubmit={onSubmit}>
        \{" "}
        <div style={S.row}>
          <div style={S.col}>
            <label style={S.label}>اسم المركز الصحي</label>
            <input
              style={S.input}
              required
              value={form.name}
              onChange={handle("name")}
            />
          </div>
          <div style={S.col}>
            <label style={S.label}>النوع</label>
            <select
              style={S.select}
              value={form.centerType}
              onChange={handle("centerType")}
            >
              <option value="Goverment">حكومي</option>
              <option value="Pricvate">خاص</option>
              <option value="None-Profit">غير ربحي</option>
            </select>
          </div>
        </div>
        {/* Address */}
        <div style={S.col}>
          <label style={S.label}>العنوان</label>
          <input
            style={S.input}
            required
            value={form.address}
            onChange={handle("address")}
          />
        </div>
        {/* Map picker */}
        <div style={{ marginTop: Theme.spacing.medium }}>
          <label style={{ ...S.label, marginBottom: 8 }}>
            اختر الموقع على الخريطة
          </label>
          <MapPicker
            lat={form.latitude && parseFloat(form.latitude)}
            lon={form.longitude && parseFloat(form.longitude)}
            onPick={handlePick}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              style={{ ...S.input, flex: 1 }}
              readOnly
              placeholder="Latitude"
              value={form.latitude}
            />
            <input
              style={{ ...S.input, flex: 1 }}
              readOnly
              placeholder="Longitude"
              value={form.longitude}
            />
          </div>
        </div>
        {/* Phone & email */}
        <div style={S.row}>
          <div style={S.col}>
            <label style={S.label}>رقم الهاتف</label>
            <input
              style={S.input}
              value={form.phoneNumber}
              onChange={handle("phoneNumber")}
            />
          </div>
          <div style={S.col}>
            <label style={S.label}>البريد الإلكتروني</label>
            <input
              style={S.input}
              type="email"
              value={form.email}
              onChange={handle("email")}
            />
          </div>
        </div>
        {/* Description */}
        <div style={S.col}>
          <label style={S.label}>وصف</label>
          <textarea
            style={S.textarea}
            value={form.discrption}
            onChange={handle("discrption")}
          />
        </div>
        {/* Submit */}
        <button style={S.submit} disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ المركز الصحي"}
        </button>
      </form>
    </>
  );
}

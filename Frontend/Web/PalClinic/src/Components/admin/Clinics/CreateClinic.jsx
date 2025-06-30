import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createClinic } from "../../../API/Clinic/Clinic";
import { Theme } from "../../../assets/Theme/Theme1";
import MapPicker from "../../general/MapPicker";

const days = [
  { key: "mon", label: "الإثنين" },
  { key: "tue", label: "الثلاثاء" },
  { key: "wed", label: "الأربعاء" },
  { key: "thu", label: "الخميس" },
  { key: "fri", label: "الجمعة" },
  { key: "sat", label: "السبت" },
  { key: "sun", label: "الأحد" },
];

const initial = {
  name: "",
  clinictype: "individual",
  address: "",
  latitude: "",
  longitude: "",
  phoneNumber: "",
  email: "",
  specialties: "",
  operating_hours: {},
  discrption: "",
};

export default function CreateClinic() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handlePick = ({ lat, lng }) =>
    setForm((f) => ({
      ...f,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));

  const updateHour = (day, field) => (e) =>
    setForm({
      ...form,
      operating_hours: {
        ...form.operating_hours,
        [day]: { ...(form.operating_hours[day] || {}), [field]: e.target.value },
      },
    });

  const toggleClosed = (day) => () =>
    setForm({
      ...form,
      operating_hours: {
        ...form.operating_hours,
        [day]: { closed: !(form.operating_hours[day]?.closed) },
      },
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      toast.error("اختر موقعًا على الخريطة");
      return;
    }

    const payload = {
      name: form.name,
      clinictype: form.clinictype,
      address: form.address,
      phoneNumber: form.phoneNumber,
      email: form.email,
      specialties: form.specialties,
      discrption: form.discrption,
      location: `POINT(${form.longitude} ${form.latitude})`,
      operating_hours: form.operating_hours,
    };

    try {
      setLoading(true);
      await createClinic(payload);
      toast.success("تم إنشاء العيادة ✔");
      setForm(initial);
    } catch (err) {
      toast.error(err.message || "خطأ في الحفظ");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Styles ---------- */
  const S = {
    card: {
      maxWidth: 720,
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
      flexWrap: "wrap",
    },
    col: { flex: 1, minWidth: 220, display: "flex", flexDirection: "column" },
    label: { marginBottom: 4, fontWeight: Theme.fontWeight.bold ,marginTop:6 },
    input: {
      padding: Theme.spacing.small,
      border: `1px solid ${Theme.border}`,
      borderRadius: Theme.borderRadius.medium,
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
    tmInput: {
      padding: 4,
      width: "90%",
      border: `1px solid ${Theme.border}`,
      borderRadius: Theme.borderRadius.small,
    },
  };

  /* ---------- UI ---------- */
  return (
    <>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar rtl />

      <form style={S.card} onSubmit={onSubmit}>
        {/* NAME + TYPE */}
        <div style={S.row}>
          <div style={S.col}>
            <label style={S.label}>اسم العيادة</label>
            <input style={S.input} required value={form.name} onChange={handle("name")} />
          </div>
          <div style={S.col}>
            <label style={S.label}>النوع</label>
            <select style={S.select} value={form.clinictype} onChange={handle("clinictype")}>
              <option value="individual">خاصة</option>
              <option value="healthcarecenter">تابع لمركز صحي</option>
            </select>
          </div>
        </div>

        {/* ADDRESS */}
        <div style={S.col}>
          <label style={S.label}>العنوان</label>
          <input style={S.input} required value={form.address} onChange={handle("address")} />
        </div>

        {/* MAP PICKER */}
        <div style={{ marginTop: Theme.spacing.medium }}>
          <label style={{ ...S.label, marginBottom: 8 }}>اختر الموقع على الخريطة</label>
          <MapPicker
            lat={form.latitude && parseFloat(form.latitude)}
            lon={form.longitude && parseFloat(form.longitude)}
            onPick={handlePick}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input style={{ ...S.input, flex: 1 }} readOnly placeholder="Latitude" value={form.latitude} />
            <input style={{ ...S.input, flex: 1 }} readOnly placeholder="Longitude" value={form.longitude} />
          </div>
        </div>

        {/* PHONE + EMAIL */}
        <div style={S.row}>
          <div style={S.col}>
            <label style={S.label}>رقم الهاتف</label>
            <input style={S.input} value={form.phoneNumber} onChange={handle("phoneNumber")} />
          </div>
          <div style={S.col}>
            <label style={S.label}>البريد الإلكتروني</label>
            <input style={S.input} type="email" value={form.email} onChange={handle("email")} />
          </div>
        </div>

        {/* SPECIALTIES */}
        <div style={S.col}>
          <label style={S.label}> </label>
          <input style={S.input} value={form.specialties} onChange={handle("specialties")} />
        </div>

        {/* OPERATING HOURS GRID */}
        <label style={{ ...S.label, marginTop: Theme.spacing.large }}>ساعات العمل</label>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16,marginTop:16 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "right" }}>اليوم</th>
              <th>من</th>
              <th>إلى</th>
              <th>مغلق</th>
            </tr>
          </thead>
          <tbody>
            {days.map(({ key, label }) => {
              const d = form.operating_hours[key] || {};
              return (
                <tr key={key}>
                  <td>{label}</td>
                  <td>
                    <input
                      style={S.tmInput}
                      type="time"
                      value={d.open || ""}
                      disabled={d.closed}
                      onChange={updateHour(key, "open")}
                    />
                  </td>
                  <td>
                    <input
                      style={S.tmInput}
                      type="time"
                      value={d.close || ""}
                      disabled={d.closed}
                      onChange={updateHour(key, "close")}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input type="checkbox" checked={!!d.closed} onChange={toggleClosed(key)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* DESCRIPTION */}
        <div style={S.col}>
          <label style={S.label}>وصف</label>
          <textarea style={S.textarea} value={form.discrption} onChange={handle("discrption")} />
        </div>

        {/* SUBMIT */}
        <button style={S.submit} disabled={loading}>
          {loading ? "…جاري الحفظ" : "حفظ العيادة"}
        </button>
      </form>
    </>
  );
}

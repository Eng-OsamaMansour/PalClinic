import React, { useEffect, useState } from "react";
import { Theme } from "../../../assets/Theme/Theme1";

const days = [
  { key: "mon",  label: "الإثنين"  },
  { key: "tue",  label: "الثلاثاء" },
  { key: "wed",  label: "الأربعاء" },
  { key: "thu",  label: "الخميس"  },
  { key: "fri",  label: "الجمعة"  },
  { key: "sat",  label: "السبت"   },
  { key: "sun",  label: "الأحد"   },
];

/* empty clinic template */
const empty = {
  clinictype: "individual",
  address: "",
  location: { latitude: "", longitude: "" },
  phoneNumber: "",
  email: "",
  operating_hours: {},    
};

/* WKT → {lon,lat} */
const parseWKT = (wkt) => {
  const m = /^POINT\((-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)\)$/.exec(wkt || "");
  return m ? { longitude: m[1], latitude: m[2] } : { longitude: "", latitude: "" };
};

export default function ClinicEditModal({ open, clinic, onClose, onSave }) {
  const [form, setForm] = useState(empty);

  /* load clinic into local state */
  useEffect(() => {
    if (clinic) {
      setForm({
        ...empty,
        ...clinic,
        location: parseWKT(clinic.location),
        operating_hours: clinic.operating_hours || {},
      });
    }
  }, [clinic]);

  if (!open || !clinic) return null;

  /* ------------ field helpers ------------ */
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const updateLoc = (k) => (e) =>
    setForm({ ...form, location: { ...form.location, [k]: e.target.value } });

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

  /* ------------ submit ------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      clinictype,
      address,
      phoneNumber,
      email,
      operating_hours,
      location,
    } = form;

    const payload = { clinictype, address, phoneNumber, email };

    /* location */
    const lat = parseFloat(location.latitude);
    const lon = parseFloat(location.longitude);
    if (!Number.isNaN(lat) && !Number.isNaN(lon))
      payload.location = `POINT(${lon} ${lat})`;

    payload.operating_hours = operating_hours;
    onSave(payload);
  };

  /* ------------ styles ------------ */
  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  };
  const card = {
    background: Theme.background,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.large,
    width: 520,
    maxWidth: "95%",
    maxHeight: "95vh",
    overflowY: "auto",
    boxShadow: "0 12px 28px rgba(0,0,0,.25)",
  };
  const lbl = { fontSize: 14, marginBottom: 4, fontWeight: 500 };
  const input = {
    width: "100%",
    marginBottom: Theme.spacing.small,
    padding: Theme.spacing.tiny,
    border: `1px solid ${Theme.border}`,
    borderRadius: 6,
  };
  const tmInput = { ...input, marginBottom: 0, padding: 2 };
  const btn = {
    width: "100%",
    border: "none",
    borderRadius: 6,
    padding: "6px 0",
    cursor: "pointer",
    marginBottom: 6,
    fontWeight: 500,
  };

  /* ------------ UI ------------ */
  return (
    <div style={overlay} onClick={onClose}>
      <form style={card} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 style={{ textAlign: "center", marginTop: 0 }}>تحديث بيانات العيادة</h3>

        {/* BASIC INFO */}
        <label style={lbl}>النوع</label>
        <select style={input} value={form.clinictype} onChange={update("clinictype")}>
          <option value="individual">فردية</option>
          <option value="healthcarecenter">تابعة لمركز صحي</option>
        </select>

        <label style={lbl}>العنوان</label>
        <input style={input} value={form.address} onChange={update("address")} />

        {/* LOCATION */}
        <label style={lbl}>خط العرض (lat)</label>
        <input
          style={input}
          type="number"
          value={form.location.latitude}
          onChange={updateLoc("latitude")}
        />

        <label style={lbl}>خط الطول (lon)</label>
        <input
          style={input}
          type="number"
          value={form.location.longitude}
          onChange={updateLoc("longitude")}
        />

        {/* CONTACT */}
        <label style={lbl}>الهاتف</label>
        <input style={input} value={form.phoneNumber} onChange={update("phoneNumber")} />

        <label style={lbl}>البريد الإلكتروني</label>
        <input style={input} value={form.email} onChange={update("email")} />

        {/* OPERATING HOURS */}
        <label style={{ ...lbl, marginTop: Theme.spacing.medium }}>ساعات العمل</label>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
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
                      style={tmInput}
                      type="time"
                      value={d.open || ""}
                      disabled={d.closed}
                      onChange={updateHour(key, "open")}
                    />
                  </td>
                  <td>
                    <input
                      style={tmInput}
                      type="time"
                      value={d.close || ""}
                      disabled={d.closed}
                      onChange={updateHour(key, "close")}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={!!d.closed}
                      onChange={toggleClosed(key)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* BUTTONS */}
        <button style={{ ...btn, background: Theme.accent, color: Theme.textInverse }}>
          حفظ
        </button>
        <button
          type="button"
          style={{ ...btn, background: Theme.disabled, color: Theme.textPrimary }}
          onClick={onClose}
        >
          إلغاء
        </button>
      </form>
    </div>
  );
}

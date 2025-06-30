import React, { useEffect, useState } from "react";
import MapPicker from "../../general/MapPicker";
import { Theme } from "../../../assets/Theme/Theme1";

const days = [
  ["mon", "الإثنين"],
  ["tue", "الثلاثاء"],
  ["wed", "الأربعاء"],
  ["thu", "الخميس"],
  ["fri", "الجمعة"],
  ["sat", "السبت"],
  ["sun", "الأحد"],
];

const empty = {
  address: "",
  latitude: "",
  longitude: "",
  phoneNumber: "",
  email: "",
  specialties: "",
  operating_hours: {},
};

export default function ClinicEditSheet({ open, clinic, onClose, onSave }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!clinic) return;
    const { location, ...rest } = clinic;
    const m = /^POINT\((-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)\)$/.exec(
      location || ""
    );
    setForm({
      ...empty,
      ...rest,
      latitude: m ? m[2] : "",
      longitude: m ? m[1] : "",
    });
  }, [clinic]);

  if (!open || !clinic) return null;

  const u = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const pick = ({ lat, lng }) =>
    setForm({ ...form, latitude: lat.toFixed(6), longitude: lng.toFixed(6) });

  const setDay = (d, f) => (e) =>
    setForm({
      ...form,
      operating_hours: {
        ...form.operating_hours,
        [d]: { ...(form.operating_hours[d] || {}), [f]: e.target.value },
      },
    });
  const toggleClosed = (d) => () =>
    setForm({
      ...form,
      operating_hours: {
        ...form.operating_hours,
        [d]: { closed: !form.operating_hours[d]?.closed },
      },
    });

  const submit = (e) => {
    e.preventDefault();
    const lat = parseFloat(form.latitude);
    const lon = parseFloat(form.longitude);
    const payload = {
      address: form.address,
      phoneNumber: form.phoneNumber,
      email: form.email,
      specialties: form.specialties,
      operating_hours: form.operating_hours,
    };
    if (!Number.isNaN(lat) && !Number.isNaN(lon))
      payload.location = `POINT(${lon} ${lat})`;
    onSave(payload);
  };

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.55)",
    overflowY: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 40,
    zIndex: 1000,
  };
  const panel = {
    width: "96%",
    maxWidth: 650,
    background: Theme.background,
    borderRadius: 20,
    padding: Theme.spacing.large,
    direction: "rtl",
    boxShadow: "0 8px 20px rgba(0,0,0,.25)",
  };
  const lbl = { fontSize: 14, marginBottom: 4, fontWeight: 600 };
  const inp = {
    width: "100%",
    marginBottom: Theme.spacing.small,
    padding: Theme.spacing.tiny,
    border: `1px solid ${Theme.border}`,
    borderRadius: 6,
  };
  const tm = { ...inp, marginBottom: 0, padding: 4 };

  return (
    <div style={overlay} onClick={onClose}>
      <form
        style={panel}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <h3 style={{ textAlign: "center", marginTop: 0 }}>
          تعديل بيانات العيادة
        </h3>

        <label style={lbl}>العنوان</label>
        <input style={inp} value={form.address} onChange={u("address")} />

        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={lbl}>الهاتف</label>
            <input
              style={inp}
              value={form.phoneNumber}
              onChange={u("phoneNumber")}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>البريد الإلكتروني</label>
            <input
              style={inp}
              type="email"
              value={form.email}
              onChange={u("email")}
            />
          </div>
        </div>

        <label style={lbl}>التخصصات</label>
        <input
          style={inp}
          value={form.specialties}
          onChange={u("specialties")}
        />

        {/* Map */}
        <label style={{ ...lbl, marginTop: 10 }}>الموقع</label>
        <div
          style={{
            height: 260,
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <MapPicker
            lat={form.latitude && parseFloat(form.latitude)}
            lon={form.longitude && parseFloat(form.longitude)}
            onPick={pick}
          />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            style={{ ...inp, flex: 1 }}
            readOnly
            value={form.latitude}
            placeholder="lat"
          />
          <input
            style={{ ...inp, flex: 1 }}
            readOnly
            value={form.longitude}
            placeholder="lon"
          />
        </div>

        {/* Hours */}
        <label style={lbl}>ساعات العمل</label>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 12,
          }}
        >
          <thead>
            <tr>
              <th>اليوم</th>
              <th>من</th>
              <th>إلى</th>
              <th>مغلق</th>
            </tr>
          </thead>
          <tbody>
            {days.map(([k, ar]) => {
              const d = form.operating_hours[k] || {};
              return (
                <tr key={k}>
                  <td style={{ whiteSpace: "nowrap" }}>{ar}</td>
                  <td>
                    <input
                      style={tm}
                      type="time"
                      disabled={d.closed}
                      value={d.open || ""}
                      onChange={setDay(k, "open")}
                    />
                  </td>
                  <td>
                    <input
                      style={tm}
                      type="time"
                      disabled={d.closed}
                      value={d.close || ""}
                      onChange={setDay(k, "close")}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={!!d.closed}
                      onChange={toggleClosed(k)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          style={{
            ...inp,
            background: Theme.accent,
            color: Theme.textInverse,
            cursor: "pointer",
          }}
        >
          حفظ
        </button>
        <button
          type="button"
          style={{ ...inp, background: Theme.disabled, cursor: "pointer" }}
          onClick={onClose}
        >
          إلغاء
        </button>
      </form>
    </div>
  );
}

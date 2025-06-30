// src/pages/ClinicModerator/AppointmentsManagment.jsx
import { useEffect, useState, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  fetchAssignedDoctors,
} from "../../API/Clinic/AppointmentAPI";
import TopNav from "../../Components/ClinicModerator/TopNav";
import TabNav from "../../Components/ClinicModerator/TabNav";
import { Theme } from "../../assets/Theme/Theme1";
import { getClinic } from "../../Config/ClinicManager";

/* ─────────────────────────────────────────────────────────── */
const STATUS_LABEL = {
  pending: "قيد الانتظار",
  completed: "مكتمل",
  canceled: "ملغى",
};

export default function AppointmentsManagment() {
  /* ------------ state ------------ */
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null); // {mode:'add'|'edit', data:obj}|null

  /* ------------ initial load ------------ */
  useEffect(() => {
    (async () => {
      try {
        const [apps, docs] = await Promise.all([
          fetchAppointments(),
          fetchAssignedDoctors(),
        ]);
        setAppointments(Array.isArray(apps) ? apps : []);
        setDoctors(
          (Array.isArray(docs) ? docs : []).map((row) => row.doctor)
        );
      } catch (e) {
        toast.error(e.message);
      }
    })();
  }, []);

  /* ------------ derived list (search + status) ------------ */
  const shownAppointments = useMemo(() => {
    const txt = filterText.toLowerCase();
    return appointments
      .filter(
        (a) => statusFilter === "all" || a.status === statusFilter
      )
      .filter((a) =>
        JSON.stringify(a).toLowerCase().includes(txt)
      );
  }, [filterText, statusFilter, appointments]);

  /* ------------ CRUD handlers ------------ */
  const handleSave = async (payload, id = null) => {
    try {
       const clinic = getClinic()
      const saved = id
        ? await updateAppointment(id, payload)
        : await createAppointment({ ...payload, status: "pending",clinic:clinic.id }); // default
      toast.success(id ? "تم التحديث ✔" : "تم الإنشاء ✔");
      setAppointments((prev) =>
        id ? prev.map((x) => (x.id === id ? saved : x)) : [...prev, saved]
      );
      setModal(null);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await deleteAppointment(id);
      toast.success("تم الحذف ✔");
      setAppointments((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      toast.error(e.message);
      console.log(e.message);
    }
  };

  /* ------------ render ------------ */
  return (
    <>
      <ToastContainer position="top-center" autoClose={2500} rtl />
      <TopNav />
      <TabNav />
      {/* search + add + status filter */}
      <div style={S.topBar}>
        <input
          style={S.search}
          placeholder="ابحث داخل المواعيد..."
          dir="rtl"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <div style={S.statusBtns}>
          {["all", "pending", "completed", "canceled"].map((k) => (
            <button
              key={k}
              style={{
                ...S.statusBtn,
                background:
                  statusFilter === k ? Theme.accent : Theme.cardBackground,
                color:
                  statusFilter === k ? Theme.textInverse : Theme.textPrimary,
              }}
              onClick={() => setStatusFilter(k)}
            >
              {k === "all" ? "الكل" : STATUS_LABEL[k]}
            </button>
          ))}
        </div>

        <button style={S.addBtn} onClick={() => setModal({ mode: "add" })}>
          +
        </button>
      </div>

      {/* list */}
      <div style={S.cardsWrapper}>
        {shownAppointments.map((a) => (
          <AppointmentCard
            key={a.id}
            data={a}
            onEdit={() => setModal({ mode: "edit", data: a })}
            onDelete={() => handleDelete(a.id)}
          />
        ))}
      </div>

      {/* modal */}
      {modal && (
        <AppointmentModal
          mode={modal.mode}
          data={modal.data}
          doctors={doctors}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

/* ───────────────────── Card component ───────────────────── */
function AppointmentCard({ data, onEdit, onDelete }) {
  const { id, date, time, doctor_name, status } = data;
  return (
    <div style={S.card}>
      <div>
        <strong>موعد #{id}</strong>
        <br />التاريخ: {date}&emsp;الوقت: {time}
        <br />الطبيب: {doctor_name || "-"}
        <br />
        الحالة: {STATUS_LABEL[status]}
      </div>
      <div style={S.cardBtns}>
        <button style={S.primaryBtn} onClick={onEdit}>
          تعديل
        </button>
        <button style={S.dangerBtn} onClick={onDelete}>
          حذف
        </button>
      </div>
    </div>
  );
}

/* ───────────────────── Modal component ───────────────────── */
function AppointmentModal({ mode, data = {}, doctors, onClose, onSave }) {
  const [form, setForm] = useState({
    date: data.date || "",
    time: data.time || "",
    doctor: data.doctor || "",
    status: data.status || "pending",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const { date, time, doctor } = form;
    if (!date || !time || !doctor) {
      toast.error("الرجاء ملء كل الحقول");
      return;
    }
    onSave(form, data.id);
  };

  return (
    <div style={S.modalBackdrop}>
      <div style={S.modal}>
        <h3>{mode === "add" ? "إضافة موعد" : "تعديل الموعد"}</h3>

        <label style={S.label}>التاريخ</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={S.input}
        />

        <label style={S.label}>الوقت</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          style={S.input}
        />

        <label style={S.label}>الطبيب</label>
        <select
          name="doctor"
          value={form.doctor}
          onChange={handleChange}
          style={S.input}
        >
          <option value="">اختر طبيباً...</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {mode === "edit" && (
          <>
            <label style={S.label}>الحالة</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={S.input}
            >
              {Object.entries(STATUS_LABEL).map(([val, lbl]) => (
                <option key={val} value={val}>
                  {lbl}
                </option>
              ))}
            </select>
          </>
        )}

        <div style={S.modalBtns}>
          <button style={S.primaryBtn} onClick={handleSubmit}>
            {mode === "add" ? "إنشاء" : "حفظ"}
          </button>
          <button style={S.dangerBtn} onClick={onClose}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Inline styles ───────────────────── */
const S = {
  /* layout & top controls */
  topBar: {
    display: "flex",
    gap: Theme.spacing.small,
    alignItems: "center",
    marginBottom: Theme.spacing.medium,
    flexWrap: "wrap",
  },
  search: {
    flex: 1,
    padding: Theme.spacing.tiny,
    border: `1px solid ${Theme.border}`,
    borderRadius: Theme.borderRadius.small,
    direction: "rtl",
  },
  statusBtns: { display: "flex", gap: 4 },
  statusBtn: {
    padding: "6px 10px",
    border: "none",
    borderRadius: Theme.borderRadius.small,
    cursor: "pointer",
    fontSize: Theme.fontSize.xSmall,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    background: Theme.accent,
    color: Theme.textInverse,
    fontSize: 24,
    cursor: "pointer",
  },
  /* list & card */
  cardsWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
    gap: Theme.spacing.medium,
  },
  card: {
    background: Theme.cardBackground,
    padding: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.medium,
    boxShadow: `0 4px 12px ${Theme.shadow}`,
    direction: "rtl",
  },
  cardBtns: { marginTop: 8, display: "flex", gap: Theme.spacing.small },
  /* buttons */
  primaryBtn: {
    flex: 1,
    padding: "4px 0",
    border: "none",
    background: Theme.accent,
    color: Theme.textInverse,
    borderRadius: Theme.borderRadius.small,
    cursor: "pointer",
  },
  dangerBtn: {
    flex: 1,
    padding: "4px 0",
    border: "none",
    background: Theme.danger,
    color: Theme.textInverse,
    borderRadius: Theme.borderRadius.small,
    cursor: "pointer",
  },
  /* modal */
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    background: Theme.cardBackground,
    padding: Theme.spacing.large,
    borderRadius: Theme.borderRadius.large,
    width: 340,
    direction: "rtl",
    boxShadow: `0 6px 18px ${Theme.shadow}`,
  },
  label: { display: "block", marginTop: Theme.spacing.small, marginBottom: 4 },
  input: {
    width: "100%",
    padding: Theme.spacing.tiny,
    border: `1px solid ${Theme.border}`,
    borderRadius: Theme.borderRadius.small,
  },
  modalBtns: {
    marginTop: Theme.spacing.medium,
    display: "flex",
    gap: Theme.spacing.small,
  },
};

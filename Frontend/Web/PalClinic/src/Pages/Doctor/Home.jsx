import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import TopNav from "../../Components/Doctor/TopNav";
import TabNav from "../../Components/Doctor/TabNav";
import AppointmentCard from "../../Components/Doctor/Home/AppointmentCard";
import { listDoctorAppointments } from "../../API/Clinic/AppointmentAPI";
import { Theme } from "../../assets/Theme/Theme1";

const statusOptions = [
  { key: "canceled", label: "ملغي" },

  { key: "pending", label: "قيد الانتظار" },
  { key: "completed", label: "مكتمل" },
  { key: "all", label: "الكل" },
];

export default function DoctorHome() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textFilter, setText] = useState("");
  const [statusFilter, setStatus] = useState("all");

  /* fetch once */
  useEffect(() => {
    (async () => {
      try {
        setData(await listDoctorAppointments());
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const match = (bk) => {
    const sOk =
      statusFilter === "all" || bk.appointment.status === statusFilter;
    const tOk = JSON.stringify(bk)
      .toLowerCase()
      .includes(textFilter.trim().toLowerCase());
    return sOk && tOk;
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        rtl
      />
      <TopNav />
      <TabNav />

      <div style={{ padding: Theme.spacing.large }}>
        <div style={styles.btnRow}>
          {statusOptions.map(({ key, label }) => (
            <button
              key={key}
              style={{
                ...styles.statusBtn,
                background:
                  key === statusFilter ? Theme.accent : Theme.navBarBackground,
                color:
                  key === statusFilter ? Theme.textInverse : Theme.textPrimary,
              }}
              onClick={() => setStatus(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          style={styles.search}
          placeholder="ابحث (اسم، تاريخ، رقم...)"
          value={textFilter}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* content */}
      {loading ? (
        <p style={{ textAlign: "center" }}>...جاري التحميل</p>
      ) : (
        <div style={styles.grid}>
          {data.filter(match).map((b) => (
            <AppointmentCard key={b.appointment.id} booking={b} />
          ))}
        </div>
      )}
    </>
  );
}

/* ---------- styles ---------- */
const styles = {
  btnRow: {
    display: "flex",
    gap: Theme.spacing.small,
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: Theme.spacing.medium,
  },
  statusBtn: {
    border: "none",
    borderRadius: 20,
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: 14,
    transition: "background 150ms",
  },
  search: {
    width: 320,
    maxWidth: "100%",
    display: "block",
    margin: "0 auto 24px",
    padding: Theme.spacing.tiny,
    border: `1px solid ${Theme.border}`,
    borderRadius: 6,
    direction: "rtl",
  },
  grid: {
    display: "grid",
    direction: "rtl", 
    gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
    gap: Theme.spacing.large,
    padding: Theme.spacing.large,
  },
};

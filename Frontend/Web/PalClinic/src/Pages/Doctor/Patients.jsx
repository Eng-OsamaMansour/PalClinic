import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import TopNav from "../../Components/Doctor/TopNav";
import TabNav from "../../Components/Doctor/TabNav";
import PatientCard from "../../Components/Doctor/Patients/PatientCard";
import PatientProfile from "../../Components/Doctor/Patients/PatientProfile";
import { listDoctorPatients } from "../../API/Doctor/DoctorPatients";
import { Theme } from "../../assets/Theme/Theme1";

export default function DoctorPatient() {
  const [patients, setPatients]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [textFilter, setText]     = useState("");
  const [selected, setSelected]   = useState(null);

  /* fetch once */
  useEffect(() => {
    (async () => {
      try   { setPatients(await listDoctorPatients()); }
      catch (e) { toast.error(e.message); }
      finally   { setLoading(false); }
    })();
  }, []);

  const match = (p) =>
    JSON.stringify(p)
      .toLowerCase()
      .includes(textFilter.trim().toLowerCase());

  return (
    <>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar rtl />
      <TopNav />
      <TabNav />

      {/* profile view */}
      {selected ? (
        <PatientProfile patient={selected} onBack={() => setSelected(null)} />
      ) : (
        <>
          {/* search */}
          <div style={{ padding: Theme.spacing.large }}>
            <input
              style={styles.search}
              placeholder="ابحث (اسم، بريد، هاتف...)"
              value={textFilter}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* cards */}
          {loading ? (
            <p style={{ textAlign: "center" }}>...جاري التحميل</p>
          ) : (
            <div style={styles.grid}>
              {patients.filter(match).map((p) => (
                <PatientCard key={p.id} patient={p} onSelect={setSelected} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

/* ---------- styles ---------- */
const styles = {
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
    direction: "rtl",                       // cards fill R→L
    gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
    gap: Theme.spacing.large,
    padding: Theme.spacing.large,
  },
};

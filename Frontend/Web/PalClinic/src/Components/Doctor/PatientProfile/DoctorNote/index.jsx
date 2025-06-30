import React, { useState, useEffect } from "react";
import { Theme } from "../../../../assets/Theme/Theme1";
import { getProfile } from "../../../../API/MedicalProfile";
import { toast, ToastContainer } from "react-toastify";
import DoctorNoteCard from "./Card";
import DoctorNoteForm from "./Form";
import { MdAdd } from "react-icons/md";

export default function DoctorNotes({ patientId }) {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const profile = await getProfile(patientId);
        setData(
          [...profile.doctor_notes].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );
      } catch (err) {
        toast.error(err.message);
      }
    }
    fetchNotes();
  }, [patientId]);


  const refresh = async () => {
    try {
      const profile = await getProfile(patientId);
      setData(
        [...profile.doctor_notes].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const matches = (n) => {
    const hay =
      `${n.doctor.name} ${n.title} ${n.note} ${n.created_at}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        rtl
      />

      {/* search */}
      <input
        style={styles.search}
        placeholder="ابحث بالتاريخ أو اسم الطبيب…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* grid */}
      <div style={styles.grid}>
        {data.filter(matches).map((n) => (
          <DoctorNoteCard key={n.created_at + n.title} note={n} />
        ))}
      </div>

      {/* floating add button (left bottom in RTL) */}
      <button style={styles.fab} onClick={() => setShowForm(true)}>
        <MdAdd size={32} />
      </button>

      {/* modal */}
      <DoctorNoteForm
        open={showForm}
        onClose={() => setShowForm(false)}
        patientId={patientId}
        onAdded={refresh}
      />
    </>
  );
}


const styles = {
  search: {
    display: "block",
    margin: "0 auto 24px",
    padding: Theme.spacing.tiny,
    border: `1px solid ${Theme.border}`,
    borderRadius: 6,
    width: 300,
    direction: "rtl",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
    gap: Theme.spacing.large,
    padding: Theme.spacing.large,
    direction: "rtl", 
  },
  fab: {
    position: "fixed",
    bottom: 32,
    left: 32, 
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "none",
    background: Theme.accent,
    color: Theme.textInverse,
    boxShadow: "0 4px 12px rgba(0,0,0,.25)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Theme } from "../../../../assets/Theme/Theme1";
import TreatmentCard from "./Card";
import TreatmentForm from "./Form";
import { getProfile, postTreatment } from "../../../../API/MedicalProfile";
import { MdAdd } from "react-icons/md";
export default function Treatment({ patientId }) {

  const [all, setAll]   = useState([]);
  const [q, setQ]       = useState("");
  const [filter, setFl] = useState("all"); 
  const [showForm, setShow] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await getProfile(patientId);
      setAll(Array.isArray(data.treatments) ? data.treatments : []);
    } catch (e) {
      toast.error(e.message);
    }
  }, [patientId]);


  useEffect(() => {
    (async () => await refresh())();
  }, [refresh]);

  const handleSave = async (body) => {
    try {
      await postTreatment(patientId, body);
      toast.success("تمت الإضافة");
      setShow(false);
      refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const shown = all
    .filter((t) =>
      JSON.stringify(t).toLowerCase().includes(q.trim().toLowerCase())
    )
    .filter((t) =>
      filter === "active" ? t.active : filter === "inactive" ? !t.active : true
    )
    .sort((a, b) => {
      if (a.active !== b.active) return a.active ? -1 : 1;
      return new Date(b.start_date) - new Date(a.start_date);
    });

  return (
    <>
      {/* top-bar */}
      <div style={S.bar}>
        <input
          style={S.search}
          placeholder="ابحث..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div style={S.filters}>
          {[
            { id: "all", label: "الكل" },
            { id: "active", label: "النشطة" },
            { id: "inactive", label: "غير النشطة" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFl(id)}
              style={{
                ...S.fBtn,
                background: filter === id ? Theme.accent : Theme.primaryLight,
                color: filter === id ? Theme.textInverse : Theme.textPrimary,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div style={S.grid}>
        {shown.map((t) => (
          <TreatmentCard key={t.created_at} data={t} />
        ))}
      </div>

      {/* floating add button */}
      <button style={S.fab} onClick={() => setShow(true)}>
        <MdAdd size={32} />
      </button>

      {/* modal form */}
      <TreatmentForm
        open={showForm}
        onClose={() => setShow(false)}
        onSave={handleSave}
      />
    </>
  );
}

/* ─────────────── styles ─────────────── */
const S = {
  bar: {
    direction: "rtl",
    padding: Theme.spacing.large,
    display: "flex",
    flexWrap: "wrap-reverse",
    gap: Theme.spacing.small,
  },
  search: {
    flex: "0 1 320px",
    padding: 8,
    border: `1px solid ${Theme.border}`,
    borderRadius: 8,
    direction: "rtl",
  },
  filters: { display: "flex", gap: 8 },
  fBtn: {
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
  },
  grid: {
    direction: "rtl",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
    gap: Theme.spacing.large,
    padding: Theme.spacing.large,
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
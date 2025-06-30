import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Theme } from "../../../../assets/Theme/Theme1";
import SurgeryCard from "./Card";
import SurgeryForm from "./Form";
import { getProfile, postSurgery } from "../../../../API/MedicalProfile";
import { MdAdd } from "react-icons/md";
export default function Surgery({ patientId }) {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [formOpen, setAdd] = useState(false);

  const refresh = async () => {
    try {
      setData((await getProfile(patientId)).surgeries);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    refresh();
  }, [patientId]);

  const save = async (body) => {
    try {
      await postSurgery(patientId, body);
      toast.success("تمت الإضافة");
      setAdd(false);
      refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const match = (s) =>
    JSON.stringify(s).toLowerCase().includes(q.trim().toLowerCase());

  return (
    <>
      <div style={styles.bar}>
        <input
          style={styles.search}
          placeholder="ابحث..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div style={styles.grid}>
        {data.filter(match).map((s) => (
          <SurgeryCard key={s.created_at} data={s} />
        ))}
      </div>

      {/* plus button bottom-left */}
      <button style={styles.plus} onClick={() => setAdd(true)}>
        <MdAdd size={32} />
      </button>
      <SurgeryForm
        open={formOpen}
        onClose={() => setAdd(false)}
        onSave={save}
      />
    </>
  );
}

const styles = {
  bar: { padding: Theme.spacing.large },
  search: {
    width: 320,
    maxWidth: "100%",
    padding: 8,
    direction: "rtl",
    border: `1px solid ${Theme.border}`,
    borderRadius: 8,
  },
  grid: {
    direction: "rtl",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
    gap: Theme.spacing.large,
    padding: Theme.spacing.large,
  },
  plus: {
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

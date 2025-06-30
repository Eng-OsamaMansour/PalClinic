import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { listClinic, patchClinic } from "../../../API/Clinic/ClinicMgmt";
import { Theme } from "../../../assets/Theme/Theme1";
import ClinicCard from "./ClinicCard";
import EditModal from "./EditModal";     

export default function ClinicsMgmt() {
  const [data, setData]       = useState([]);
  const [filter, setFilter]   = useState("");
  const [editing, setEditing] = useState(null);


  useEffect(() => { refresh(); }, []);

  const refresh = async () => {
    try   { setData(await listClinic()); }
    catch (e) { toast.error(e.message); }
  };


  const deactivate = async (clinic) => {
    if (!window.confirm(`تعطيل ${clinic.name}؟`)) return;
    try {
      await patchClinic(clinic.id, { is_active: false });
      toast.success("تم التعطيل");
      setData((d) => d.filter((c) => c.id !== clinic.id));
    } catch (e) {
      toast.error(e.message);
    }
  };


  const saveEdit = async (form) => {
    const {
      id,
      clinictype,
      address,
      phoneNumber,
      email,
      specialties,
      operating_hours,
      discrption,
      location,
    } = form;

    const payload = {
      clinictype,
      address,
      phoneNumber,
      email,
      specialties,
      operating_hours,
      discrption,
    };
    const lat = parseFloat(location.latitude);
    const lon = parseFloat(location.longitude);
    if (!Number.isNaN(lat) && !Number.isNaN(lon))
      payload.location = `POINT(${lon} ${lat})`;

    try {
      await patchClinic(id, payload);
      toast.success("تم الحفظ");
      setEditing(null);
      await refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const matches = (c) =>
    Object.values(c)
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase());

  return (
    <>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar rtl />
      <h2 style={{ textAlign: "center", marginTop: 0 }}>إدارة العيادات</h2>

      <input
        style={styles.search}
        placeholder="ابحث..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div style={styles.grid}>
        {data.filter(matches).map((clinic) => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            onDeactivate={deactivate}
            onEdit={setEditing}
          />
        ))}
      </div>
      <EditModal
        open={Boolean(editing)}
        clinic={editing}
        onClose={() => setEditing(null)}
        onSave={saveEdit}
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
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(390px,1fr))",
    columnGap: Theme.spacing.large,
    rowGap: Theme.spacing.medium,
  },
};

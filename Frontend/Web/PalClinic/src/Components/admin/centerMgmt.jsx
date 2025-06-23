import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { listCenters, patchCenter } from "../../API/HealthCentersMgmt";
import { Theme } from "../../assets/Theme/Theme1";
import CenterCard from "./CenterCard";
import EditModal from "./EditModal";

export default function HealthCentersMgmt() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      setData(await listCenters());
    } catch (e) {
      toast.error(e.message);
    }
  };

  const deactivate = async (center) => {
    if (!window.confirm(`تعطيل ${center.name}؟`)) return;
    try {
      await patchCenter(center.id, { is_active: false });
      toast.success("تم التعطيل");
      setData((d) => d.filter((c) => c.id !== center.id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const saveEdit = async (form) => {
    const {
      id,
      centerType,
      address,
      phoneNumber,
      email,
      discrption,
      location,
    } = form;

    const payload = { centerType, address, phoneNumber, email, discrption };

    const lat = parseFloat(location.latitude);
    const lon = parseFloat(location.longitude);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      payload.location = `POINT(${lon} ${lat})`;
    }

    try {
      await patchCenter(id, payload);
      toast.success("تم الحفظ");
      setEditing(null);
      await refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const matches = (c) =>
    Object.values(c).join(" ").toLowerCase().includes(filter.toLowerCase());

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        rtl
      />
      <h2 style={{ textAlign: "center", marginTop: 0 }}>
        إدارة المراكز الصحية
      </h2>

      <input
        style={styles.search}
        placeholder="ابحث..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div style={styles.grid}>
        {data.filter(matches).map((center) => (
          <CenterCard
            key={center.id}
            center={center}
            onDeactivate={deactivate}
            onEdit={setEditing}
          />
        ))}
      </div>

      <EditModal
        open={Boolean(editing)}
        center={editing}
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
  gridTemplateColumns: "repeat(auto-fill, minmax(390px, 1fr))",
  columnGap: Theme.spacing.large,  
  rowGap: Theme.spacing.medium,   
},
};

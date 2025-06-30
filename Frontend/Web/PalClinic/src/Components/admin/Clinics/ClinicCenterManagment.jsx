import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  getUnassignedClinicsCenter,
  getCenters,
  assignClinicToCenter,
  getAssignments,
  deactivateAssignment,
} from "../../../API/Clinic/ClinicCenterManagment";
import { Theme } from "../../../assets/Theme/Theme1";
function AssignCard() {
  const [clinic, setClinic] = useState([]);
  const [center, setCenter] = useState([]);
  const [cFilter, setCFilter] = useState("");
  const [mFilter, setMFilter] = useState("");
  const [selectedClinics, setSelectedClinics] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [c, m] = await Promise.all([
          getUnassignedClinicsCenter(),
          getCenters(),
        ]);
        setClinic(c);
        setCenter(m);
      } catch (e) {
        toast.error(e.message);
      }
    }
    fetchData();
  }, []);

  console.log(center);
  const onAssign = async () => {
    if (!selectedClinics || !selectedCenter) return;
    try {
        console.log(selectedClinics.id)
      await assignClinicToCenter(selectedCenter.id, selectedClinics.id);
      toast.success("تم التعيين بنجاح ✔");
      setClinic((c) => c.filter((x) => x.id !== selectedClinics.id));
      setSelectedClinics(null);
      setSelectedCenter(null);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const table = (rows, filter, setSel, selId, fld, onFilterChange, label) => (
    <div style={S.tableBox}>
      <label style={S.label}>{label}</label>
      <input
        style={S.search}
        placeholder="بحث..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      />
      <table style={S.table}>
        <tbody>
          {rows
            .filter((r) =>
              String(r[fld] || "")
                .toLowerCase()
                .includes(filter.toLowerCase())
            )
            .map((r) => (
              <tr
                key={r.id}
                onClick={() => setSel(r)}
                style={{
                  background: selId === r.id ? Theme.highlight : "transparent",
                  cursor: "pointer",
                }}
              >
                <td>{r[fld]}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={S.card}>
      <h3 style={S.title}>اضافة عيادة الى مركز صحي</h3>

      <div style={S.row}>
        {table(
          clinic,
          cFilter,
          setSelectedClinics,
          selectedClinics?.id,
          "name",
          setCFilter,
          "ابحث عن العيادات"
        )}
        {table(
          center,
          mFilter,
          setSelectedCenter,
          selectedCenter?.id,
          "name",
          setMFilter,
          "ابحث عن المراكز"
        )}
      </div>

      <button
        style={{
          ...S.primaryBtn,
          opacity: !(selectedClinics && selectedCenter) ? 0.4 : 1,
          cursor: !(selectedClinics && selectedCenter) ? "not-allowed" : "pointer",
        }}
        disabled={!(selectedClinics && selectedCenter)}
        onClick={onAssign}
      >
        تعيين
      </button>
    </div>
  );
}

function UnassignCard() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setRows(await getAssignments());
      } catch (e) {
        toast.error(e.message);
      }
    }
    fetchData();
  }, []);

  const onDeactivate = async (id) => {
    try {
      await deactivateAssignment(id);
      toast.success("تم الإلغاء ✔");
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div style={S.card}>
      <h3 style={S.title}>إلغاء العيادة من المركز </h3>

      <label style={S.label}>بحث</label>
      <input
        style={S.search}
        placeholder="بحث باسم المركز أو اسم العيادة"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <table style={S.table}>
        <thead>
          <tr>
            <th>العيادة</th>
            <th> المركز</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows
            .filter(
              (r) =>
                String(r.health_name || "")
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                String(r.clinic_name || "")
                  .toLowerCase()
                  .includes(filter.toLowerCase())
            )
            .map((r) => (
              <tr key={r.id}>
                <td>{r.clinic_name}</td>
                <td>{r.health_name}</td>
                <td>
                  <button
                    style={S.dangerBtn}
                    onClick={() => onDeactivate(r.id)}
                  >
                    إلغاء
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ClinicCenterManagment() {
  const [tab, setTab] = useState("assign");
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        rtl
      />
      <div style={S.tabBar}>
        <button
          style={{
            ...S.tab,
            borderBottom:
              tab === "assign" ? `3px solid ${Theme.accent}` : "none",
          }}
          onClick={() => setTab("assign")}
        >
          تعيين مشرف
        </button>
        <button
          style={{
            ...S.tab,
            borderBottom:
              tab === "unassign" ? `3px solid ${Theme.accent}` : "none",
          }}
          onClick={() => setTab("unassign")}
        >
          إلغاء تعيين
        </button>
      </div>

      {tab === "assign" ? <AssignCard /> : <UnassignCard />}
    </>
  );
}


const S = {
  tabBar: {
    display: "flex",
    borderBottom: `1px solid ${Theme.border}`,
    marginBottom: Theme.spacing.medium,
  },
  tab: {
    flex: 1,
    padding: Theme.spacing.small,
    fontWeight: Theme.fontWeight.bold,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  card: {
    background: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.large,
    boxShadow: `0 10px 25px ${Theme.shadow}`,
    maxWidth: 900,
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: Theme.spacing.medium,
    fontSize: Theme.fontSize.heading,
  },
  row: {
    display: "flex",
    gap: Theme.spacing.medium,
    flexWrap: "wrap",
  },
  tableBox: { flex: 1, minWidth: 300 },
  label: { fontWeight: Theme.fontWeight.medium, marginBottom: 4 },
  search: {
    width: "100%",
    marginBottom: Theme.spacing.small,
    padding: Theme.spacing.tiny,
    border: `1px solid ${Theme.border}`,
    borderRadius: Theme.borderRadius.small,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  primaryBtn: {
    marginTop: Theme.spacing.medium,
    width: "100%",
    padding: Theme.spacing.small,
    background: Theme.accent,
    color: Theme.textInverse,
    border: "none",
    borderRadius: Theme.borderRadius.medium,
  },
  dangerBtn: {
    background: Theme.danger,
    color: Theme.textInverse,
    border: "none",
    borderRadius: Theme.borderRadius.small,
    padding: "4px 10px",
    cursor: "pointer",
  },
};

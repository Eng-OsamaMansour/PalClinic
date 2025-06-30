import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  MdCake,
  MdTransgender,
  MdBloodtype,
  MdHeight,
  MdMonitorWeight,
  MdVaccines,
  MdFavorite,
} from "react-icons/md";
import { Theme } from "../../../assets/Theme/Theme1";
import { getProfile } from "../../../API/MedicalProfile";

export default function BasicInfo({ patientId }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setInfo((await getProfile(patientId)).basic_info);
      } catch (e) {
        toast.error(e.message);
      }
    })();
  }, [patientId]);

  if (!info) return <p style={{ textAlign: "center" }}>…جاري التحميل</p>;

  const rows = [
    { l: "العمر", v: `${info.age} سنة`, ic: MdCake },
    { l: "الجنس", v: info.gender, ic: MdTransgender },
    { l: "فصيلة الدم", v: info.blood_type, ic: MdBloodtype },
    { l: "الطول", v: `${info.height} م`, ic: MdHeight },
    { l: "الوزن", v: `${info.weight} كغ`, ic: MdMonitorWeight },
    { l: "الحساسيات", v: info.allergies, ic: MdVaccines },
    { l: "الأمراض المزمنة", v: info.chronic_conditions, ic: MdFavorite },
  ];

  return (
    <div style={C.card}>
      <h4 style={C.h}>المعلومات الأساسية</h4>
      {rows.map(({ l, v, ic: Icon }) => (
        <div key={l} style={C.row}>
          <Icon style={C.icon} />
          <strong style={C.lab}>{l}:</strong>&nbsp;{v}
        </div>
      ))}
    </div>
  );
}

/* style */
const C = {
  card: {
    direction: "rtl",
    background: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.large,
    boxShadow: "0 6px 14px rgba(0,0,0,.08)",
    maxWidth: 420,
    margin: "0 auto",
    lineHeight: 1.9,
  },
  h: { textAlign: "center", marginTop: 0, color: Theme.primary },
  row: {
    display: "flex",
    gap: 6,
    alignItems: "center",
    padding: "6px 0",
    borderBottom: `1px solid ${Theme.border}`,
    fontSize: 15,
  },
  icon: { color: Theme.accent, fontSize: 18 },
  lab: { minWidth: 110, display: "inline-block" },
};

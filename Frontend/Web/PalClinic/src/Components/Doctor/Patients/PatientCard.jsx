import React from "react";
import { Theme } from "../../../assets/Theme/Theme1";
import { Link } from "react-router-dom";
export default function PatientCard({ patient, onSelect }) {
  return (
    <Link to={`/doctor/patients/profile/${patient.id}`} style={{ textDecoration: 'none' ,color: 'inherit'}}>
      <div style={S.card} onClick={() => onSelect(patient)}>
        <h4 style={S.h}>{patient.name}</h4>
        <div style={S.row}>
          <strong>البريد:</strong>&nbsp;{patient.email}
        </div>
        <div style={S.row}>
          <strong>الهاتف:</strong>&nbsp;{patient.phoneNumber}
        </div>
      </div>
    </Link>
  );
}

const S = {
  card: {
    direction: "rtl",
    background: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.medium,
    boxShadow: "0 6px 14px rgba(0,0,0,.08)",
    cursor: "pointer",
    transition: "transform .15s",
  },
  h: { margin: 0, marginBottom: 6, color: Theme.textPrimary },
  row: { marginBottom: 4, fontSize: 15 },
};

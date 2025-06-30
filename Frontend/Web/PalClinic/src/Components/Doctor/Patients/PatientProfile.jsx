import React from "react";
import { Theme } from "../../../assets/Theme/Theme1";
import SideBar from "./SideBar";
import { useState } from "react";
import TopNav from "../TopNav";
import TabNav from "../TabNav";
import BasicInfo from "../PatientProfile/BasicInfo";
import Surgery from "../PatientProfile/Surgery";
import LabTest from "../PatientProfile/LabTest";
import Treatment from "../PatientProfile/Treatment";
import DoctorNotes from "../PatientProfile/DoctorNote";
import { useParams } from "react-router-dom";
export default function PatientProfile({ patient, onBack }) {
  const [active, setActive] = useState("BasicInfo");
  const { patientId } = useParams();
  console.log(patientId);
  const View = {
    BasicInfo: () => <BasicInfo patientId={patientId} />,
    Surgery: () => <Surgery patientId={patientId} />,
    LabTest: () => <LabTest patientId={patientId} />,
    Treatment: () => <Treatment patientId={patientId} />,
    DoctorNote: () => <DoctorNotes patientId={patientId} />,
  }[active];

  return (
    <>
      <TopNav />
      <TabNav />
      <div style={S.page}>
        <main style={S.content}>
          <View />
        </main>
        <SideBar active={active} onChange={setActive} />
      </div>
    </>
  );
}

const S = {
  page: {
    minHeight: "calc(100vh - 120px)" ,
    display: "flex",
    flexDirection: "row-reverse" ,
    direction: "rtl",
  },
  side: {
    width: 220,
    borderLeft: `1px solid ${Theme.border}`,
    backgroundColor: Theme.background,
    display: "flex",
    flexDirection: "column",
  },
  item: {
    padding: `${Theme.spacing.medium}px ${Theme.spacing.small}px`,
    textAlign: "right",
    border: "none",
    borderBottom: `1px solid ${Theme.border}`,
    background: "none",
    fontSize: Theme.fontSize.normal,
    cursor: "pointer",
    transition: "background-color 150ms",
  },
  content: {
    flexGrow: 1,
    padding: Theme.spacing.large,
  },
};

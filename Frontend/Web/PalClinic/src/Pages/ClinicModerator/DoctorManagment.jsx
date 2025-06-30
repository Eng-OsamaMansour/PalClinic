
import SideBar from "../../Components/ClinicModerator/DoctorManagement/SideBar"
import { Theme } from "../../assets/Theme/Theme1";
import { useState } from "react";
import TopNav from "../../Components/ClinicModerator/TopNav";
import TabNav from "../../Components/ClinicModerator/TabNav";
import CreateDoctor from "../../Components/ClinicModerator/DoctorManagement/CreateDoctor";
import AssigmentsManagement from "../../Components/ClinicModerator/DoctorManagement/AssigmentsManagement";
export default function DoctorManagementPage() {
  const [active, setActive] = useState("createDoc");

  const View = {
    createDoc:CreateDoctor,
    manageDocs:AssigmentsManagement
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
    minHeight: "calc(100vh - 120px)" /* leave space for TopNav + TabNav */,
    display: "flex",
    flexDirection: "row-reverse" /* sidebar on the right in RTL */,
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


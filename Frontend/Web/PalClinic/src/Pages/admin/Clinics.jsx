
import CreateClinic from "../../Components/admin/Clinics/CreateClinic";
import CreateCModerator from "../../Components/admin/Clinics/CreateCModerator";
import ModeratorManagement from "../../Components/admin/Clinics/ModeratorManagement";
import ClinicsMgmt from "../../Components/admin/Clinics/clinicMgmt";
import ClinicCenterManagment from "../../Components/admin/Clinics/ClinicCenterManagment";
{
  /*need to change*/
}

import SideBar from "../../Components/admin/Clinics/SideBar";
import { Theme } from "../../assets/Theme/Theme1";
import { useState } from "react";
import TopNav from "../../Components/admin/TopNav";
import TabNav from "../../Components/admin/TabNav";
export default function ClinicAdminPage() {
  const [active, setActive] = useState("createClinic");

  const View = {
    createClinic: CreateClinic,
    createMod: CreateCModerator,
    manageMods: ModeratorManagement,
    manageClinics: ClinicsMgmt,
    assignClinic: ClinicCenterManagment

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


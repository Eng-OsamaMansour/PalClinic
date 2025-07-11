import CreateHealthCenter from "../../Components/admin/HealthCareCenters/CreateHealthCenter";
import CreateHCModerator from "../../Components/admin/HealthCareCenters/CreateHCModerator";
import ModeratorManagement from "../../Components/admin/HealthCareCenters/ModeratorManagement";
import HealthCentersMgmt from "../../Components/admin/HealthCareCenters/centerMgmt";

import SideBar from "../../Components/admin/HealthCareCenters/sideBar";
import { Theme } from "../../assets/Theme/Theme1";
import { useState } from "react";
import TopNav from "../../Components/admin/TopNav";
import TabNav from "../../Components/admin/TabNav";
export default function HealthCenterAdminPage() {
  const [active, setActive] = useState("createCenter");

  const View = {
    createCenter: CreateHealthCenter,
    createMod: CreateHCModerator,
    manageMods: ModeratorManagement,
    manageCenters: HealthCentersMgmt,
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

/* ───────────── Styles ───────────── */
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

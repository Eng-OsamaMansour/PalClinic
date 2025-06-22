/* -------------------------------------------------
 *  TabNav.jsx  –  Five-item bottom tab bar
 *  -------------------------------------------------
 *  • React-Router-DOM v6
 *  • react-icons/mdi (Material Design glyphs)
 *  • RTL-friendly, uses your Theme
 * -------------------------------------------------*/

import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdHomeFilled,
  MdFavorite,          // medical file (heartbeat)
  MdMedicalServices,   // health centres
  MdNotificationsNone, // notifications
  MdPersonOutline,     // doctors
} from "react-icons/md";

import { Theme } from "../../assets/Theme/Theme1";      

export default function TabNav() {
  const tabs = [
    { to: "/admin/healthCenters",            Icon: MdHomeFilled,         label: "المراكز الصحية" },
    { to: "/admin/clinics",     Icon: MdFavorite,           label: "العيادات" },
    { to: "/admin/statistics", Icon: MdNotificationsNone, label: "الاحصاءات" },
  ];

  return (
    <nav style={S.wrapper}>
      {tabs.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          style={({ isActive }) => ({
            ...S.tab,
            color: isActive ? Theme.accent : Theme.textSecondary,
            borderBottomColor: isActive ? Theme.accent : "transparent",
          })}
        >
          <Icon size={26} style={S.icon} />
          <span style={S.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

/* ────────── Styles ────────── */
const S = {
  wrapper: {
    height: 64,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Theme.navBarBackground,
    borderBottom: `1px solid ${Theme.border}`,
    direction: "rtl", 
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  tab: {
    flexGrow: 1,
    textAlign: "center",
    paddingTop: 6,
    paddingBottom: 8,
    textDecoration: "none",
    fontSize: Theme.fontSize.small,
    borderBottom: "2px solid transparent",
    transition: "color 150ms ease, border-color 150ms ease",
  },
  icon: { marginBottom: 4 },
  label: { display: "block" },
};

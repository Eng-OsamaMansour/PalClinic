import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdHomeFilled,
  MdFavorite,          
  MdMedicalServices,   
  MdNotificationsNone, 
  MdPersonOutline,    
} from "react-icons/md";

import { Theme } from "../../assets/Theme/Theme1";      

export default function TabNav() {
  const tabs = [
    { to: "/doctor/home", Icon: MdHomeFilled, label: "الرئيسية" },
    { to: "/doctor/patients", Icon: MdPersonOutline, label: "المرضى" },
    { to: "/doctor/requests", Icon: MdMedicalServices, label: "طلبات الصلاحية" },
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

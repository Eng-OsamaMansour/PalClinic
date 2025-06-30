
import React from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout, MdOutlineChatBubbleOutline } from "react-icons/md";
import { Theme } from "../../assets/Theme/Theme1";

export default function TopNav({ title = "PalClinic", onChat, onBack }) {
  const navigate = useNavigate();

  const handleBack = onBack || (() => navigate(-1));
  const S = {
    wrapper: {
      height: 56,
      paddingInline: Theme.spacing.medium,
      backgroundColor: Theme.navBarBackground,
      borderBottom: `1px solid ${Theme.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 10,
    },
    side: {
      width: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      color: Theme.accent,
      cursor: "pointer",
    },
    center: {
      display: "flex",
      alignItems: "center",
      gap: Theme.spacing.small,
      fontWeight: Theme.fontWeight.bold,
      fontSize: Theme.fontSize.heading,
      color: Theme.textPrimary,
      userSelect: "none",
    },
    logoBox: {
      width: 34,
      height: 34,
      borderRadius: 8,
      padding: 3,
      backgroundImage:
        "repeating-linear-gradient(45deg,#707070 0 4px,transparent 4px 8px)",
    },
    logo: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      borderRadius: 4,
      backgroundColor: "#fff",
    },
  };

  return (
    <header style={S.wrapper}>
      {/* ← Left icon */}
      <div style={S.side} onClick={handleBack} title="رجوع">
        <MdLogout style={{ transform: "scaleX(-1)" }} />
      </div>

      {/* ── Brand (center) */}
      <div style={S.center}>
        <div style={S.logoBox}>
          <img src="/assets/logo.png" alt="PalClinic" style={S.logo} />
        </div>
        {title}
      </div>


    </header>
  );
}

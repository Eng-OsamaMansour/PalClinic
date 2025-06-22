/* -------------------------------------------------
 *  LoginPage.jsx  –  Web login page w/ react-toastify
 *  -------------------------------------------------*/

import React, { use, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import login, { getUserApi } from "../../API/Auth/LogIn";
import { clearTokens, setTokens } from "../../Config/TokenManager";
import { clearUser, getUser, setUser } from "../../Config/UserManager";
import { Theme } from "../../assets/Theme/Theme1";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      const data = await res.json();
      if (res.ok) {
        setTokens(data.access, data.refresh);
        toast.success("تم تسجيل الدخول بنجاح ✔");
        const userData = await getUserApi();
        const user = await userData.json();
        console.log(user.role);
        if (userData.ok) {
          setUser(user);
          if (user.role === "admin") {
            setTimeout(() => window.location.replace("/admin/healthCenters"), 800);
          } else if (user.role === "clinic_moderator") {
            setTimeout(() => window.location.replace("/clinicModerator"), 800);
          }
          if (user.role === "healthcarecenter_moderator") {
            setTimeout(() => window.location.replace("/healthModerator"), 800);
          } else if (user.role === "patient") {
            toast.info(
              "الموقع لا يدعم حسابالت المرضى يرجى تسجيل الدخول من التطبيق"
            );
            clearTokens();
            clearUser();
          }
        }
      } else {
        toast.error(data?.detail || "خطأ في تسجيل الدخول ✖");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const S = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg, #f5fafe 0%, #ffffff 50%, #f5fafe 100%)",
    },
    card: {
      width: 380,
      padding: Theme.spacing.large,
      borderRadius: Theme.borderRadius.large,
      backgroundColor: Theme.background,
      boxShadow: `0 12px 24px ${Theme.shadow}`,
      textAlign: "center",
    },
    logoWrapper: {
      width: 120,
      height: 120,
      margin: "0 auto",
      marginBottom: Theme.spacing.large,
      borderRadius: 24,
      padding: 8,
      backgroundImage:
        "repeating-linear-gradient(45deg, #707070 0 4px, transparent 4px 8px)",
    },
    logoImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: 16,
      backgroundColor: "#fff",
    },
    input: {
      width: "100%",
      padding: Theme.spacing.small,
      marginBottom: Theme.spacing.medium,
      fontSize: Theme.fontSize.normal,
      borderRadius: Theme.borderRadius.medium,
      border: `1px solid ${Theme.border}`,
      outline: "none",
      transition: "border-color 150ms",
    },
    button: {
      width: "100%",
      padding: Theme.spacing.small,
      fontSize: Theme.fontSize.normal,
      fontWeight: Theme.fontWeight.bold,
      color: Theme.textInverse,
      backgroundColor: Theme.primary,
      border: "none",
      borderRadius: Theme.borderRadius.medium,
      cursor: "pointer",
      transition: "opacity 150ms",
      opacity: loading ? 0.6 : 1,
    },
    link: {
      marginTop: Theme.spacing.small,
      display: "inline-block",
      fontSize: Theme.fontSize.small,
      color: Theme.primary,
      textDecoration: "none",
    },
  };
  /* ───────────  UI  ─────────── */
  return (
    <div style={S.page}>
      {/* Toasts */}
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        rtl
      />

      {/* Login card */}
      <form style={S.card} onSubmit={handleSubmit}>
        {/* Logo */}
        <div style={S.logoWrapper}>
          <img src="/assets/logo.png" alt="PalClinic Logo" style={S.logoImg} />
        </div>

        {/* Email */}
        <input
          style={S.input}
          type="email"
          placeholder="البريد الإلكتروني"
          dir="rtl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          style={S.input}
          type="password"
          placeholder="كلمة المرور"
          dir="rtl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Login */}
        <button style={S.button} disabled={loading}>
          {loading ? "جاري التحقق..." : "تسجيل الدخول"}
        </button>

        {/* Register link */}
        <a href="/register" style={S.link}>
          إنشاء حساب
        </a>
      </form>
    </div>
  );
}

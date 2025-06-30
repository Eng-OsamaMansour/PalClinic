import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createDoctor} from "../../../API/Moderators";
import { Theme } from "../../../assets/Theme/Theme1";

export default function CreateDoctor() {
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "" });
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null); // ← temp pwd

  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createDoctor(form);
      setCredentials({ email: data.email, pw: data.temp_password });
      toast.success("تم إنشاء المشرف بنجاح ✔");
      setForm({ name: "", email: "", phoneNumber: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* —— styles —— */
  const S = {
    card: {
      maxWidth: 500,
      margin: "0 auto",
      background: Theme.cardBackground,
      borderRadius: Theme.borderRadius.large,
      padding: Theme.spacing.large,
      boxShadow: `0 10px 25px ${Theme.shadow}`,
      fontSize: Theme.fontSize.normal,
    },
    label: { fontWeight: Theme.fontWeight.medium, marginBottom: 4 },
    input: {
      width: "100%",
      padding: Theme.spacing.small,
      border: `1px solid ${Theme.border}`,
      borderRadius: Theme.borderRadius.medium,
      marginBottom: Theme.spacing.medium,
    },
    submit: {
      width: "100%",
      padding: Theme.spacing.small,
      fontWeight: Theme.fontWeight.bold,
      color: Theme.textInverse,
      background: Theme.accent,
      border: "none",
      borderRadius: Theme.borderRadius.medium,
      cursor: "pointer",
      opacity: loading ? 0.6 : 1,
    },
    credsBox: {
      marginTop: Theme.spacing.large,
      background: "#fff",
      border: `1px dashed ${Theme.border}`,
      borderRadius: Theme.borderRadius.medium,
      padding: Theme.spacing.medium,
      textAlign: "center",
      direction: "ltr",
    },
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        rtl
      />
      <form style={S.card} onSubmit={onSubmit}>
        <label style={S.label}>اسم الطبيب</label>
        <input
          style={S.input}
          value={form.name}
          onChange={handle("name")}
          required
        />

        <label style={S.label}>البريد الإلكتروني</label>
        <input
          style={S.input}
          type="email"
          value={form.email}
          onChange={handle("email")}
          required
        />

        <label style={S.label}>رقم الهاتف</label>
        <input
          style={S.input}
          value={form.phoneNumber}
          onChange={handle("phoneNumber")}
        />

        <button style={S.submit} disabled={loading}>
          {loading ? "جاري الإنشاء..." : "إنشاء الطبيب"}
        </button>

        {/* credentials panel */}
        {credentials && (
          <div style={S.credsBox}>
            <strong>{credentials.email}</strong>
            <br />
            كلمة المرور المؤقتة:
            <br />
            <code>{credentials.pw}</code>
          </div>
        )}
      </form>
    </>
  );
}

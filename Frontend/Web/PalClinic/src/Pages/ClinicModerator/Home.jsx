import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import TopNav from "../../Components/ClinicModerator/TopNav";
import TabNav from "../../Components/ClinicModerator/TabNav";
import ClinicOverview from "../../Components/ClinicModerator/Home/ClinicOverview";
import ClinicEditSheet from "../../Components/ClinicModerator/Home/ClinicEditSheet";
import { listClinic, patchClinic } from "../../API/Clinic/ClinicMgmt";
import { getClinic, setClinic } from "../../Config/ClinicManager";
import { Theme } from "../../assets/Theme/Theme1";
import { getUser } from "../../Config/UserManager";

export default function ClinicMHome() {
  const [clinic, setClinicState] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  /* load clinic */
  useEffect(() => {
    setClinicState(getClinic());
  }, []);
  /* save */
  const handleSave = async (payload) => {
    try {
      const updated = await patchClinic(clinic.id, payload);
      toast.success("تم الحفظ");
      setClinic(updated);
      setClinicState(updated);
      setEditOpen(false);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        rtl
      />
      <TopNav />
      <TabNav />

      {!clinic ? (
        <p style={{ textAlign: "center", padding: 40 }}>جاري التحميل…</p>
      ) : (
        <div style={{ padding: Theme.spacing.large }}>
          <ClinicOverview clinic={clinic} onEdit={() => setEditOpen(true)} />
        </div>
      )}

      <ClinicEditSheet
        open={editOpen}
        clinic={clinic}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}

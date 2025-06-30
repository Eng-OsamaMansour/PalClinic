/* ──────────────────────────────────────────────────────────
 *  DoctorRequests.jsx (v2 – lazy-render patients slice)
 * ────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Theme } from "../../assets/Theme/Theme1";
import {
  fetchRequests,
  fetchPatients,
  sendRequest,
} from "../../API/Doctor/access"
import RequestCard from "../../Components/Doctor/DoctorAccess/RequestCard";
import PatientCard from "../../Components/Doctor/DoctorAccess/PatientCard";
import TopNav from "../../Components/Doctor/TopNav";
import TabNav from "../../Components/Doctor/TabNav";

const FIRST_LOAD   = 20;  
const SLICE_APPEND = 10;  

export default function DoctorRequests() {
  /* ───────── state ───────── */
  const [reqs, setReqs] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [qReq, setQReq] = useState("");
  const [qPat, setQPat] = useState("");
  const [slice, setSlice] = useState(FIRST_LOAD);

  const sentinel = useRef(null);


  useEffect(() => {
    (async () => {
      try {
        const r = await fetchRequests();
        setReqs(
          [...r].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );
        setAllPatients(await fetchPatients());
      } catch (err) {
        toast.error(err.message);
      }
    })();
  }, []);


  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSlice((s) => s + SLICE_APPEND);
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [sentinel]);


  useEffect(() => setSlice(FIRST_LOAD), [qPat]);

  const requestedIds = new Set(reqs.map((r) => r.patient.id));

  const visibleReqs = reqs
    .filter((r) => (filterStatus === "all" ? true : r.status === filterStatus))
    .filter((r) =>
      `${r.patient.name} ${r.patient.email} ${r.status}`
        .toLowerCase()
        .includes(qReq.toLowerCase())
    );

  const visiblePatients = allPatients
    .filter((p) => !requestedIds.has(p.id))
    .filter((p) =>
      `${p.name} ${p.email} ${p.phoneNumber}`
        .toLowerCase()
        .includes(qPat.toLowerCase())
    )
    .slice(0, slice);

  const doSend = async (patientId) => {
    try {
      await sendRequest(patientId);
      toast.success("تم إرسال الطلب");
      const refreshed = await fetchRequests();
      setReqs(
        [...refreshed].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
    } catch (err) {
      toast.error(err.message);
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
      <TopNav/>
      <TabNav/>
      {/* Requests section ––––––––––––––––––––– */}
      <h2 style={{...S.h2,marginTop:20}}>طلبات الوصول</h2>

      <div style={S.filterRow}>
        {["all", "accepted", "pending", "rejected"].map((s) => (
          <button
            key={s}
            style={{
              ...S.fltBtn,
              background:
                filterStatus === s ? Theme.accent : Theme.navBarBackground,
              color:
                filterStatus === s ? Theme.textInverse : Theme.textPrimary,
            }}
            onClick={() => setFilterStatus(s)}
          >
            {s === "all"
              ? "الكل"
              : s === "accepted"
              ? "المقبولة"
              : s === "pending"
              ? "قيد الانتظار"
              : "المرفوضة"}
          </button>
        ))}
        <input
          style={S.search}
          placeholder="بحث..."
          value={qReq}
          onChange={(e) => setQReq(e.target.value)}
        />
      </div>

      <div style={S.grid}>
        {visibleReqs.map((r) => (
          <RequestCard key={r.id} req={r} />
        ))}
      </div>

      {/* Patients section ––––––––––––––––––––– */}
      <h2 style={S.h2}>إرسال طلب جديد</h2>

      <input
        style={{ ...S.search, marginBottom: 24, width: "99%" , alignSelf:"center"}}
        placeholder="بحث عن مريض..."
        value={qPat}
        onChange={(e) => setQPat(e.target.value)}
      />

      <div style={S.grid}>
        {visiblePatients.map((p) => (
          <PatientCard key={p.id} patient={p} onSend={doSend} />
        ))}
      </div>

      {/* invisible observer - div */}
      <div ref={sentinel} style={{ height: 1 }} />
    </>
  );
}

const S = {
  h2: { textAlign: "center", marginTop: 5, direction: "rtl" },
  filterRow: {
    display: "flex",
    flexWrap: "wrap-reverse",
    gap: Theme.spacing.tiny,
    alignItems: "center",
    direction: "rtl",
    marginBottom: Theme.spacing.small,
  },
  fltBtn: {
    padding: "4px 10px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: Theme.fontSize.tiny,
  },
  search: {
    flexGrow: 1,
    padding: Theme.spacing.tiny,
    border: `1px solid ${Theme.border}`,
    borderRadius: 6,
    direction: "rtl",

  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
    gap: Theme.spacing.large,
    padding: Theme.spacing.large,
    direction: "rtl",
  },
};

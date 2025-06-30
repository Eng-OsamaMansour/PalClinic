import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { listRooms, fetchMessages, openSocket } from "../../API/Chat";
import { Theme } from "../../assets/Theme/Theme1";
import { getUser } from "../../Config/UserManager";
import RoomCard from "./RoomCard";
import TopNav from "../Doctor/TopNav";


const ME_ID = getUser()?.id;

export default function ChatPage() {
  const [rooms, setRooms]   = useState([]);
  const [active, setActive] = useState(null);  
  const [msgs, setMsgs]     = useState([]);
  const [input, setInput]   = useState("");
  const wsRef               = useRef(null);
  const endRef              = useRef(null);

  useEffect(() => {
    (async () => {
      try       { setRooms(await listRooms()); }
      catch (e) { toast.error(e.message); }
    })();
  }, []);

  useEffect(() => {
    if (!active) return;

    if (wsRef.current) wsRef.current.close();

    (async () => {
      try {
        setMsgs(await fetchMessages(active.id));          
        const ws = await openSocket(active.name);
        wsRef.current = ws;

        ws.onmessage = (ev) =>
          setMsgs((prev) => [...prev, JSON.parse(ev.data)]);

        ws.onerror = ()  => toast.error("خطأ في الاتصال");
        ws.onclose = ()  => console.log("WS closed");
      } catch (err) {
        toast.error(err.message);
      }
    })();

  
    return () => wsRef.current && wsRef.current.close();
  }, [active]);

  /* autoscroll */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  /* send helper */
  const send = () => {
    if (!input.trim()) return;
    wsRef.current?.send(JSON.stringify({ message: input.trim() }));
    setInput("");
  };

  /* ─────────────────────── render ─────────────────────── */
  return (
    <>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar rtl />
      <TopNav title="المحادثة" />

      <div style={S.page}>
        {/* chat pane */}
        <section style={S.chat}>
          {active ? (
            <>
              <header style={S.chatHeader}>{active.title || active.name}</header>

              <div style={S.scroll}>
                {msgs.map((m) => (
                  <Bubble key={m.id} msg={m} isMe={m.author === ME_ID} />
                ))}
                <div ref={endRef} />
              </div>

              <footer style={S.inputRow}>
                <input
                  style={S.textIn}
                  placeholder="اكتب رسالتك..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button style={S.sendBtn} onClick={send}>إرسال</button>
              </footer>
            </>
          ) : (
            <p style={{ textAlign: "center", marginTop: 80 }}>
              اختر غرفة لبدء المحادثة
            </p>
          )}
        </section>

        {/* rooms list */}
        <aside style={S.side}>
          <h3 style={S.sideTitle}>الغرف</h3>
          <div style={S.roomsScroll}>
            {rooms.map((r) => (
              <RoomCard
                key={r.id}
                room={r}
                selected={active?.id === r.id}
                onClick={() => setActive(r)}
              />
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

/* ── Bubble component ── */
function Bubble({ msg, isMe }) {
  const box = {
    alignSelf: isMe ? "flex-start" : "flex-end",
    background: isMe ? Theme.accent : Theme.cardBackground,
    color: isMe ? Theme.textInverse : Theme.textPrimary,
    padding: Theme.spacing.small,
    borderRadius: isMe
      ? `${Theme.borderRadius.large} 0 ${Theme.borderRadius.large} ${Theme.borderRadius.large}`
      : `0 ${Theme.borderRadius.large} ${Theme.borderRadius.large} ${Theme.borderRadius.large}`,
    maxWidth: "75%",
    direction: "rtl",
    marginBottom: 6,
    whiteSpace: "pre-wrap",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  return <div style={box}>{msg.body}</div>;
}

/* ── styles ── */
const S = {
  page: {
    display: "flex",
    flexDirection: "row-reverse",
    height: "calc(100vh - 56px)", // minus TopNav
    direction: "rtl",
    background: Theme.background,
  },
  /* side */
  side: {
    width: 220,
    borderLeft: `1px solid ${Theme.border}`,
    overflowY: "auto",
    padding: Theme.spacing.small,
    background: Theme.navBarBackground,
  },
  sideTitle: { marginTop: 0, textAlign: "center" },
  roomsScroll: { display: "flex", flexDirection: "column", gap: 6 },

  /* chat */
  chat: { flexGrow: 1, display: "flex", flexDirection: "column" },
  chatHeader: {
    padding: Theme.spacing.small,
    borderBottom: `1px solid ${Theme.border}`,
    textAlign: "center",
    fontWeight: Theme.fontWeight.bold,
    background: Theme.cardBackground,
  },
  scroll: {
    flexGrow: 1,
    padding: Theme.spacing.medium,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  inputRow: {
    display: "flex",
    padding: Theme.spacing.small,
    borderTop: `1px solid ${Theme.border}`,
    gap: 6,
    background: Theme.navBarBackground,
  },
  textIn: {
    flexGrow: 1,
    padding: Theme.spacing.small,
    border: `1px solid ${Theme.border}`,
    borderRadius: 8,
    outline: "none",
  },
  sendBtn: {
    padding: "0 14px",
    border: "none",
    background: Theme.accent,
    color: Theme.textInverse,
    borderRadius: 8,
    cursor: "pointer",
  },
};

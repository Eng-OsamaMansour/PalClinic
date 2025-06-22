// ChatContext.js
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { listRooms, listMessages } from "../api/chat";
import { BASE_WS } from "../config/Config";
import { getValidAccessToken } from "../config/ValidAccessToken";

export const ChatCtx = createContext();

/* ─────────────────────────────────────────────────────────── */

export function ChatProvider({ children }) {
  /* global state */
  const [rooms, setRooms] = useState([]); // list sidebar
  const [messages, setMessages] = useState({}); // { roomName: [msg,…] }
  const sockets = useRef({}); // { roomName: WebSocket }

  /* ─ helper: fetch all rooms once ─ */
  const refreshRooms = useCallback(async () => {
    setRooms(await listRooms());
  }, []);

  /* ─ helper: open (or reuse) one socket ─ */
  const openSocket = useCallback(async (roomName) => {
    if (sockets.current[roomName]) return sockets.current[roomName];

    const token = await getValidAccessToken();
    const ws = new WebSocket(`${BASE_WS}/ws/chat/${roomName}/?token=${token}`);

    ws.onmessage = ({ data }) => {
      const msg = JSON.parse(data);

      /* update last-message preview */
      setRooms((prev) =>
        prev.map((r) => (r.name === roomName ? { ...r, last_message: msg } : r))
      );

      /* merge into room timeline (dedup optimistic) */
      setMessages((prev) => {
        const prevList = prev[roomName] || [];

        // ① drop if the real message is already in the list
        if (prevList.some((p) => p.id === msg.id)) return prev;

        // ② drop matching optimistic placeholder
        const stripped = prevList.filter(
          (p) =>
            !(
              p.id < 0 && // temp id
              p.body === msg.body &&
              p.author === msg.author
            )
        );

        return { ...prev, [roomName]: [...stripped, msg] };
      });
    };

    sockets.current[roomName] = ws;
    return ws;
  }, []);

  /* ─ helper: initial page fetch (runs once per room) ─ */
  const loadFirstPage = useCallback(
    async (roomId, roomName) => {
      if (messages[roomName]) return; // already cached
      const data = await listMessages(roomId, 1);

      const firstBatch = Array.isArray(data)
        ? data.reverse()
        : (data.results || []).reverse();

      setMessages((prev) => ({ ...prev, [roomName]: firstBatch }));
    },
    [messages]
  );

  /* ─ helper: prepend older page when user scrolls up ─ */
  const prependOlderMessages = useCallback((roomName, older) => {
    setMessages((prev) => {
      const current = prev[roomName] || [];
      const deduped = older.filter((o) => !current.some((c) => c.id === o.id));
      return { ...prev, [roomName]: [...deduped, ...current] };
    });
  }, []);

  /* ─ send via WS with optimistic bubble ─ */
  const sendWS = useCallback((roomName, body, optimistic) => {
    const ws = sockets.current[roomName];
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message: body }));
      /* optimistic insert */
      setMessages((prev) => ({
        ...prev,
        [roomName]: [...(prev[roomName] || []), optimistic],
      }));
      return true;
    }
    return false;
  }, []);

  /* load rooms once at boot */
  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  /* expose API */
  return (
    <ChatCtx.Provider
      value={{
        rooms,
        messages,
        refreshRooms,
        openSocket,
        loadFirstPage,
        prependOlderMessages,
        sendWS,
      }}
    >
      {children}
    </ChatCtx.Provider>
  );
}

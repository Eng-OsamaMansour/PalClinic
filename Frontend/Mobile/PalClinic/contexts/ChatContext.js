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

export function ChatProvider({ children }) {
  /* global state */
  const [rooms, setRooms]       = useState([]);   // sidebar list
  const [messages, setMessages] = useState({});   // { slug: [msg,…] }
  const sockets  = useRef({});                    // { slug: WebSocket }

  /* ─ helper: fetch all rooms once ─ */
  const refreshRooms = useCallback(async () => {
    setRooms(await listRooms());
  }, []);

  /* ─ helper: open (or reuse) a socket ─ */
  const openSocket = useCallback(async (roomSlug) => {
    if (sockets.current[roomSlug]) return sockets.current[roomSlug];

    const jwt = await getValidAccessToken();
    const ws  = new WebSocket(
      `${BASE_WS}/ws/chat/${encodeURIComponent(roomSlug)}/?token=${jwt}`
    );

    ws.onmessage = ({ data }) => {
      const msg = JSON.parse(data);

      /* update last-message preview */
      setRooms((prev) =>
        prev.map((r) => (r.name === roomSlug ? { ...r, last_message: msg } : r))
      );

      /* insert incoming msg (prepend) and dedupe vs optimistic */
      setMessages((prev) => {
        const prevList = prev[roomSlug] || [];

        // duplicate real msg?
        if (prevList.some((p) => p.id === msg.id)) return prev;

        // strip matching optimistic placeholder
        const stripped = prevList.filter(
          (p) =>
            !(
              typeof p.id === "string" && p.id.startsWith("temp-") && // temp id
              p.body   === msg.body &&
              p.author === msg.author
            )
        );

        return { ...prev, [roomSlug]: [msg, ...stripped] };  // prepend
      });
    };

    sockets.current[roomSlug] = ws;
    return ws;
  }, []);

  /* ─ helper: first page of history ─ */
  const loadFirstPage = useCallback(
    async (roomId, roomSlug) => {
      if (messages[roomSlug]) return;               // already cached

      const data        = await listMessages(roomId, 1);
      const firstBatch  = Array.isArray(data)
        ? data.reverse()
        : (data.results || []).reverse();

      setMessages((prev) => ({ ...prev, [roomSlug]: firstBatch }));
    },
    [messages]
  );

  /* ─ helper: prepend older page on scroll ─ */
  const prependOlderMessages = useCallback((roomSlug, older) => {
    setMessages((prev) => {
      const current = prev[roomSlug] || [];
      const deduped = older.filter((o) => !current.some((c) => c.id === o.id));
      return { ...prev, [roomSlug]: [...deduped, ...current] };
    });
  }, []);

  /* ─ send through WS with optimistic bubble ─ */
  const sendWS = useCallback((roomSlug, body, optimistic) => {
    const ws = sockets.current[roomSlug];
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message: body }));

      // optimistic bubble at the start (matches inverted FlatList)
      setMessages((prev) => ({
        ...prev,
        [roomSlug]: [optimistic, ...(prev[roomSlug] || [])],
      }));
      return true;
    }
    return false;
  }, []);

  /* initial load */
  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  /* expose context */
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

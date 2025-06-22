import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {
  registerDeviceToken,
  listNotifications,
  unreadCount,
} from "../api/Notifications";
import { BASE_WS } from "../config/Config";
import { getValidAccessToken } from "../config/ValidAccessToken";

export const NotificationCtx = createContext();

export function NotificationProvider({ children }) {
  /* ── state ────────────────────── */
  const [items, setItems] = useState([]); // notifications list
  const [unread, setUnread] = useState(0); // badge
  const socketRef = useRef(null);

  /* ── helpers ──────────────────── */
  const loadInitial = useCallback(async () => {
    setItems(await listNotifications());
    setUnread(await unreadCount());
  }, []);

  const addItem = useCallback((obj) => {
    setItems((prev) => [obj, ...prev]);
    setUnread((prev) => prev + 1);
  }, []);

  /* ── web-socket live feed ─────── */
  useEffect(() => {
    (async () => {
      /* auth token as query-param keeps it simple */
      const token = await getValidAccessToken();
      const ws = new WebSocket(
        `${BASE_WS}/ws/notifications/?token=${token}`
      );
      socketRef.current = ws;

      ws.onmessage = ({ data }) => {
        try {
          addItem(JSON.parse(data));
        } catch (e) {
          console.warn("WS parse error", e);
        }
      };
      ws.onerror = (e) => console.warn("WS error", e.message);
      ws.onclose = () => console.log("WS closed");
    })();

    return () => socketRef.current?.close();
  }, [addItem]);

  /* ── push-token registration ───── */
  useEffect(() => {
    (async () => {
      if (!Device.isDevice) return;
      const { status: existing } = await Notifications.getPermissionsAsync();
      const { status } =
        existing !== "granted"
          ? await Notifications.requestPermissionsAsync()
          : { status: existing };

      if (status !== "granted") return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      await registerDeviceToken(tokenData.data, Device.osName.toLowerCase());
    })();
  }, []);

  /* ── first load on mount ───────── */
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  /* ── public API ────────────────── */
  const markAsRead = async (id) => {
    await markRead(id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setUnread((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <NotificationCtx.Provider
      value={{ items, unread, loadInitial, markAsRead }}
    >
      {children}
    </NotificationCtx.Provider>
  );
}

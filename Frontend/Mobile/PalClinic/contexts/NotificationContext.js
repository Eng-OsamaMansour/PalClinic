import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import {
  registerDeviceToken,
  listNotifications,
  unreadCount,
  markRead,
} from "../api/Notifications";
import { BASE_WS } from "../config/Config";
import { getValidAccessToken } from "../config/ValidAccessToken";

export const NotificationCtx = createContext(null);

const EXPO_PROJECT_ID = "1a031ec1-acb5-41df-ae34-af8d441d4f9b";
const WS_PATH = "/ws/notifications/";

export function NotificationProvider({ children }) {
  /* state */
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);

  /* helpers */
  const loadInitial = useCallback(async () => {
    setItems(await listNotifications());
    setUnread(await unreadCount());
  }, []);

  const addItem = useCallback((obj) => {
    setItems((prev) => [obj, ...prev]);
    setUnread((prev) => prev + 1);
  }, []);

  /* Web-socket */
  useEffect(() => {
    (async () => {
      const jwt = await getValidAccessToken();
      const ws = new WebSocket(`${BASE_WS}${WS_PATH}?token=${jwt}`);
      socketRef.current = ws;

      ws.onmessage = ({ data }) => {
        try {
          addItem(JSON.parse(data));
        } catch (err) {
          console.warn("WS parse error:", err);
        }
      };
      ws.onerror = (e) => console.warn("WS error:", e.message);
      ws.onclose = () => console.log("WS closed");
    })();

    return () => socketRef.current?.close();
  }, [addItem]);

  /* Push-token registration */
  useEffect(() => {
    (async () => {
      if (!Device.isDevice) return;

      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
      });

      const { status: current } = await Notifications.getPermissionsAsync();
      const { status } =
        current !== "granted"
          ? await Notifications.requestPermissionsAsync()
          : { status: current };
      if (status !== "granted") return;

      const { data: expoToken } = await Notifications.getExpoPushTokenAsync({
        projectId: EXPO_PROJECT_ID,
      });
      await registerDeviceToken(expoToken, Device.osName.toLowerCase());
    })();
  }, []);

  useEffect(() => {
    const sub1 = Notifications.addNotificationReceivedListener((n) => {
      const payload = n.request.content.data.notification;
      if (payload) addItem(payload);
    });
    const sub2 = Notifications.addNotificationResponseReceivedListener(
      (resp) => {
        const payload = resp.notification.request.content.data.notification;
        if (payload) addItem(payload);
      }
    );

    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, [addItem]);

  /* first load */
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  /* public */
  const markAsReadSafe = async (id) => {
    await markRead(id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setUnread((prev) => Math.max(prev - 1, 0));
  };

  return (
    <NotificationCtx.Provider
      value={{ items, unread, loadInitial, markAsRead: markAsReadSafe }}
    >
      {children}
    </NotificationCtx.Provider>
  );
}

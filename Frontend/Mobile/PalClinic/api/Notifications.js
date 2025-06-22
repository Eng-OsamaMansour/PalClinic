import { BASE_URL } from "../config/Config";
import { getValidAccessToken } from "../config/ValidAccessToken";

const authHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getValidAccessToken()}`,
});


export const listNotifications = async () =>
  fetch(`${BASE_URL}/notifications/`, { headers: await authHeaders() }).then(
    (r) => r.json()
  );

export const markRead = async (id) =>
  fetch(`${BASE_URL}/notifications/${id}/read/`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify({ unread: false }),
  });

export const unreadCount = async () =>
  fetch(`${BASE_URL}/notifications/unread-count/`, {
    headers: await authHeaders(),
  })
    .then((r) => r.json())
    .then(({ unread }) => unread);


export const registerDeviceToken = async (token, platform) =>
  fetch(`${BASE_URL}/notifications/device-tokens/`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ token, platform }),
  });

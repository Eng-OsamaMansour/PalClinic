import { BASE_URL } from "../Config/Urls";
import { BASE_WS }  from "../Config/Urls";
import { getValidAccessToken } from "../Config/ValidAccessToken";

async function api(path, opts = {}) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("!token");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    ...opts,
  });
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(data?.detail || `ERROR ${res.status}`);
  return data;
}


export const listRooms = () => api("/chat/rooms/");
export const createRoom = (payload) => api("/chat/rooms/create/", { method: "POST", body: JSON.stringify(payload) });
export const fetchMessages = (roomId) => api(`/chat/rooms/${roomId}/messages/`);

export async function openSocket(roomName) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("!token");
  const url = `${BASE_WS}/ws/chat/${encodeURIComponent(roomName)}/?token=${token}`;
  return new WebSocket(url);
}

import { BASE_URL } from "../config/Config";
import { getValidAccessToken } from "../config/ValidAccessToken";

const authHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getValidAccessToken()}`,
});

// rooms
export const listRooms = async () =>
  fetch(`${BASE_URL}/chat/rooms/`, { headers: await authHeaders() }).then((r) =>
    r.json()
  );

export const createRoom = async (name) =>
  fetch(`${BASE_URL}/chat/rooms/create/`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ name }),
  }).then((r) => r.json());

// messages (REST fallback / pagination)
export const listMessages = async (roomId, page = 1) =>
  fetch(`${BASE_URL}/chat/rooms/${roomId}/messages/?page=${page}`, {
    headers: await authHeaders(),
  }).then((r) => r.json());

export const sendMessageREST = async (roomId, body) =>
  fetch(`${BASE_URL}/chat/rooms/${roomId}/messages/create/`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ body }),
  });

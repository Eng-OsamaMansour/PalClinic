// tokenUtils.ts / .js (ESM)
import { jwtDecode } from "jwt-decode";
import {
  getAccessToken,
  refreshAccessToken,
  clearTokens,
} from "./TokenManager";

export async function getValidAccessToken() {
  let token = await getAccessToken();
  if (!token) return refreshAccessToken(); // nothing yet

  try {
    const { exp } = jwtDecode(token); // ← works
    const now = (Date.now() / 1000) | 0; // int seconds

    if (exp < now + 60) token = await refreshAccessToken();
    return token;
  } catch (err) {
    console.log("[JWT Decode Error]", err);
    //await clearTokens();                        // wipe corrupt tokens
    return null;
  }
}

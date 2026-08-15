// In production, always use relative paths so requests go through the
// same-origin Vercel rewrite proxy (see vercel.json) — this is what makes
// the session cookie first-party instead of cross-site, which browsers
// like Safari otherwise block. REACT_APP_API_URL is only used for local
// dev, where there's no Vercel proxy and we talk to the backend directly.
const BASE = process.env.NODE_ENV === "production"
  ? ""
  : (process.env.REACT_APP_API_URL || "http://localhost:5001");

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.error || `HTTP ${res.status}`), { status: res.status });
  }
  // DELETE (and some other) endpoints commonly reply 204 No Content or an
  // empty body — calling res.json() on that throws a SyntaxError, which was
  // silently aborting the caller (e.g. History.jsx never got to update its
  // local state after a successful delete, so the UI looked stale until a
  // manual refresh). Treat "no body" as a success with no payload instead.
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function getMe() { return (await apiFetch("/api/auth/me")).user; }
export async function logout() { await apiFetch("/api/auth/logout", { method: "POST" }); }

export async function registerUser({ username, email, password }) {
  const res = await apiFetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.user;
}

export async function loginUser({ identifier, password }) {
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  return res.user;
}

export async function forgotPassword(email) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword({ token, email, password }) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, email, password }),
  });
}

export async function detectImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`${BASE}/api/detect`, { method: "POST", credentials: "include", body: fd });
  if (!res.ok) { const b = await res.json().catch(()=>({})); throw new Error(b.error||`HTTP ${res.status}`); }
  return res.json();
}

export async function getHistory({ page=1, perPage=20 }={}) { return apiFetch(`/api/history?page=${page}&per_page=${perPage}`); }
export async function getHistoryStats() { return apiFetch("/api/history/stats"); }
export async function deleteHistoryEntry(id) { return apiFetch(`/api/history/${id}`, { method: "DELETE" }); }
export async function clearHistory() { return apiFetch("/api/history", { method: "DELETE" }); }

export function getLocalHistory() {
  try { return JSON.parse(localStorage.getItem("ns_history") || "[]"); } catch { return []; }
}
export function saveLocalHistory(entry) {
  const list = [{ id: Date.now(), scanned_at: new Date().toISOString(), ...entry }, ...getLocalHistory()].slice(0, 50);
  localStorage.setItem("ns_history", JSON.stringify(list));
}
export function deleteLocalEntry(id) {
  localStorage.setItem("ns_history", JSON.stringify(getLocalHistory().filter(e => e.id !== id)));
}
export function clearLocalHistory() { localStorage.removeItem("ns_history"); }
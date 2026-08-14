const BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.error || `HTTP ${res.status}`), { status: res.status });
  }
  return res.json();
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

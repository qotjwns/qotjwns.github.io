const DEFAULT_API_BASE = "/api/notion";
const API_BASE = import.meta.env.VITE_NOTION_API_BASE || DEFAULT_API_BASE;

async function requestJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    const error = new Error(message || `Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchPosts() {
  return requestJson("/posts");
}

export async function fetchPost(slug) {
  return requestJson(`/posts/${encodeURIComponent(slug)}`);
}

export function getApiBase() {
  return API_BASE;
}

// 역할: 프론트엔드에서 Notion 프록시 API를 호출하는 클라이언트 유틸입니다.
import { getNotionApiBase } from "../config/env.js";

const API_BASE = getNotionApiBase();

async function requestJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    const error = new Error(message || `Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  try {
    return await response.json();
  } catch {
    const error = new Error("Invalid JSON response from API");
    error.status = 502;
    throw error;
  }
}

export async function fetchPosts(tag) {
  const params = new URLSearchParams();
  if (tag) {
    params.set("tag", tag);
  }
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/posts${suffix}`);
}

export async function fetchPost(slug) {
  return requestJson(`/posts/${encodeURIComponent(slug)}`);
}

export function getApiBase() {
  return API_BASE;
}

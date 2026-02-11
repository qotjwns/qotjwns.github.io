const DEFAULT_API_BASE = "/api/notion";

function isValidApiBase(value) {
  if (!value) {
    return false;
  }

  // Accept absolute paths ("/api/notion") and absolute URLs.
  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getNotionApiBase() {
  const raw = import.meta.env.VITE_NOTION_API_BASE;
  if (!isValidApiBase(raw)) {
    if (raw) {
      console.warn(
        `Invalid VITE_NOTION_API_BASE: "${raw}". Falling back to ${DEFAULT_API_BASE}.`
      );
    }
    return DEFAULT_API_BASE;
  }

  return raw.replace(/\/$/, "") || DEFAULT_API_BASE;
}

export { DEFAULT_API_BASE };

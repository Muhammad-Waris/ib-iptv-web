import type {
  DeviceStatus,
  PlaylistData,
  PlaylistPayload,
  ApiError,
} from "@/types";

export type { DeviceStatus, PlaylistData, ApiError };

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

const FALLBACK_ERROR = "Something went wrong. Please try again.";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  if (!API_BASE_URL) {
    const err: ApiError = {
      message: "API URL is not configured. Please try again later.",
      statusCode: 500,
    };
    throw err;
  }

  const url = `${API_BASE_URL}${path}`;
  const { headers, ...requestOptions } = options ?? {};
  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...requestOptions,
    headers: requestHeaders,
  });

  if (!res.ok) {
    let message = FALLBACK_ERROR;
    try {
      const body = await res.json();
      if (typeof body.message === "string") {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = body.message.join(". ");
      } else if (typeof body.error === "string") {
        message = body.error;
      }
    } catch {
      // ignore parse errors
    }
    const err: ApiError = { message, statusCode: res.status };
    throw err;
  }

  const text = await res.text();
  if (!text) return null as T;

  const parsed = JSON.parse(text) as T;

  // Backend returns {} when no data exists — normalize to null for nullable endpoints
  if (
    parsed !== null &&
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    Object.keys(parsed as Record<string, unknown>).length === 0
  ) {
    return null as T;
  }

  return parsed;
}

// ─── API Functions ───────────────────────────────────────────────────────────

/** Register / login a device */
export function registerDevice(mac_address: string, device_key: string) {
  return request<Record<string, unknown>>("/device/register", {
    method: "POST",
    body: JSON.stringify({ mac_address, device_key }),
  });
}

/** Get device subscription status */
export function getDeviceStatus(mac: string) {
  return request<DeviceStatus>(
    `/device/status?mac=${encodeURIComponent(mac)}`
  );
}

/** Add a playlist (M3U or Xtream) */
export function addPlaylist(
  mac_address: string,
  device_key: string,
  playlist: PlaylistPayload
) {
  return request<Record<string, unknown>>("/playlist/add", {
    method: "POST",
    body: JSON.stringify({ mac_address, device_key, ...playlist }),
  });
}

/** Get all playlists for a device */
export async function getPlaylists(mac: string): Promise<PlaylistData[]> {
  const data = await request<PlaylistData | PlaylistData[] | null>(
    `/playlist?mac=${encodeURIComponent(mac)}`
  );
  if (Array.isArray(data)) {
    return data;
  }

  return data ? [data] : [];
}

/** Get the first playlist for views that only need one result */
export async function getPlaylist(mac: string): Promise<PlaylistData | null> {
  const playlists = await getPlaylists(mac);
  return playlists.length > 0 ? playlists[0] : null;
}

/** Activate a subscription plan */
export function activateSubscription(
  mac_address: string,
  device_key: string,
  plan: "trial" | "yearly" | "lifetime"
) {
  return request<Record<string, unknown>>("/activate", {
    method: "POST",
    body: JSON.stringify({ mac_address, device_key, plan }),
  });
}

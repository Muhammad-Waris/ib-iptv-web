import type { DeviceStatus, PlaylistData, PlaylistPayload, ApiError } from "@/types";

export type { DeviceStatus, PlaylistData, ApiError };

const BASE_URL = "/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      if (typeof body.message === "string") {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = body.message.join(". ");
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

/** Get current playlist for a device */
export async function getPlaylist(mac: string): Promise<PlaylistData | null> {
  const data = await request<PlaylistData | PlaylistData[] | null>(
    `/playlist?mac=${encodeURIComponent(mac)}`
  );
  if (Array.isArray(data)) {
    return data.length > 0 ? data[0] : null;
  }
  return data;
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

import type {
  DeviceStatus,
  PlaylistData,
  PlaylistPayload,
  ApiError,
} from "@/types";

export type { DeviceStatus, PlaylistData, ApiError };
export type PlaylistId = NonNullable<
  PlaylistData["id"] | PlaylistData["_id"] | PlaylistData["playlist_id"]
>;

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

function isMissingRoute(err: unknown): boolean {
  const apiErr = err as Partial<ApiError>;
  return apiErr.statusCode === 404 || apiErr.statusCode === 405;
}

async function requestWithRouteFallbacks<T>(
  candidates: Array<{ path: string; options: RequestInit }>
): Promise<T> {
  let routeErr: unknown;

  for (const candidate of candidates) {
    try {
      return await request<T>(candidate.path, candidate.options);
    } catch (err: unknown) {
      if (!isMissingRoute(err)) throw err;
      routeErr = err;
    }
  }

  throw routeErr;
}

function playlistBody(
  playlist_id: PlaylistId,
  mac_address: string,
  device_key: string,
  extra?: Record<string, unknown>
) {
  return JSON.stringify({
    id: playlist_id,
    playlist_id,
    mac_address,
    device_key,
    ...extra,
  });
}

function extractPlaylists(
  data: PlaylistData | PlaylistData[] | { data?: unknown; playlists?: unknown; playlist?: unknown } | null
): PlaylistData[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  if (
    "playlists" in data &&
    Array.isArray(data.playlists)
  ) {
    return data.playlists as PlaylistData[];
  }

  if ("data" in data && Array.isArray(data.data)) {
    return data.data as PlaylistData[];
  }

  if (
    "playlist" in data &&
    data.playlist &&
    typeof data.playlist === "object" &&
    !Array.isArray(data.playlist)
  ) {
    return [data.playlist as PlaylistData];
  }

  return [data as PlaylistData];
}

export function isActivePlaylist(playlist: PlaylistData): boolean {
  return Boolean(
    playlist.is_active ??
      playlist.active ??
      playlist.is_default ??
      playlist.default
  );
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

/** Update an existing playlist */
export async function updatePlaylist(
  playlist_id: PlaylistId,
  mac_address: string,
  device_key: string,
  playlist: PlaylistPayload
) {
  const body = playlistBody(playlist_id, mac_address, device_key, playlist);

  return requestWithRouteFallbacks<Record<string, unknown>>([
    { path: "/playlist/update", options: { method: "POST", body } },
    { path: "/playlist/update", options: { method: "PUT", body } },
    {
      path: `/playlist/${encodeURIComponent(String(playlist_id))}`,
      options: { method: "PUT", body },
    },
  ]);
}

/** Delete an existing playlist */
export async function deletePlaylist(
  playlist_id: PlaylistId,
  mac_address: string,
  device_key: string
) {
  const body = playlistBody(playlist_id, mac_address, device_key);

  return requestWithRouteFallbacks<Record<string, unknown>>([
    { path: "/playlist/delete", options: { method: "POST", body } },
    { path: "/playlist/delete", options: { method: "DELETE", body } },
    {
      path: `/playlist/${encodeURIComponent(String(playlist_id))}`,
      options: { method: "DELETE", body },
    },
  ]);
}

/** Set one playlist as the active/default playlist for a device */
export async function activatePlaylist(
  playlist_id: PlaylistId,
  mac_address: string,
  device_key: string
) {
  const body = playlistBody(playlist_id, mac_address, device_key);

  return requestWithRouteFallbacks<Record<string, unknown>>([
    { path: "/playlist/activate", options: { method: "POST", body } },
    {
      path: `/playlist/${encodeURIComponent(String(playlist_id))}/activate`,
      options: { method: "POST", body },
    },
  ]);
}

/** Get all playlists for a device */
export async function getPlaylists(mac: string): Promise<PlaylistData[]> {
  const data = await request<
    | PlaylistData
    | PlaylistData[]
    | { data?: unknown; playlists?: unknown; playlist?: unknown }
    | null
  >(
    `/playlist?mac=${encodeURIComponent(mac)}`
  );
  return extractPlaylists(data);
}

/** Get the active playlist, falling back to the first saved playlist */
export async function getPlaylist(mac: string): Promise<PlaylistData | null> {
  const playlists = await getPlaylists(mac);
  return playlists.find(isActivePlaylist) ?? playlists[0] ?? null;
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

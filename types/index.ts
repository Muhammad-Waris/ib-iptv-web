// ─── Session ─────────────────────────────────────────────────────────────────

export interface Session {
  mac_address: string;
  device_key: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface DeviceStatus {
  is_active: boolean;
  plan: string;
  expires_at: string | null;
  days_remaining: number;
}

export type PlaylistType = "m3u" | "xtream";

export interface PlaylistData {
  id?: string | number;
  _id?: string | number;
  playlist_id?: string | number;
  device_id?: string | number;
  name?: string;
  title?: string;
  playlist_name?: string;
  type?: PlaylistType;
  is_active?: boolean;
  active?: boolean;
  is_default?: boolean;
  default?: boolean;
  m3u_url?: string;
  xtream_username?: string;
  xtream_password?: string;
  xtream_base_url?: string;
  created_at?: string;
  updated_at?: string;
  last_updated?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// ─── Playlist Payloads ───────────────────────────────────────────────────────

export type PlaylistPayload =
  | { type: "m3u"; name: string; m3u_url: string }
  | {
      type: "xtream";
      name: string;
      xtream_username: string;
      xtream_password: string;
      xtream_base_url: string;
    };

// ─── Plans ───────────────────────────────────────────────────────────────────

export type PlanType = "trial" | "yearly" | "lifetime";

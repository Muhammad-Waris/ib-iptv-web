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

export interface PlaylistData {
  type?: "m3u" | "xtream";
  m3u_url?: string;
  xtream_username?: string;
  xtream_password?: string;
  xtream_base_url?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// ─── Playlist Payloads ───────────────────────────────────────────────────────

export type PlaylistPayload =
  | { type: "m3u"; m3u_url: string }
  | {
      type: "xtream";
      xtream_username: string;
      xtream_password: string;
      xtream_base_url: string;
    };

// ─── Plans ───────────────────────────────────────────────────────────────────

export type PlanType = "trial" | "yearly" | "lifetime";

export const PLAYLISTS_CHANGED_EVENT = "iptv:playlists-changed";
export const PLAYLISTS_CHANGED_STORAGE_KEY = "iptv_playlists_changed_at";

export function notifyPlaylistsChanged() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAYLISTS_CHANGED_STORAGE_KEY, String(Date.now()));
  window.dispatchEvent(new Event(PLAYLISTS_CHANGED_EVENT));
}

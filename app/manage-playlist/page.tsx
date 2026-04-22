"use client";

import { useEffect, useState } from "react";
import Card from "@/components/card";
import Button from "@/components/button";
import Input from "@/components/input";
import SectionWrapper from "@/components/section-wrapper";
import Spinner from "@/components/spinner";
import Toast from "@/components/toast";
import ErrorMessage from "@/components/error-message";
import AuthGuard from "@/components/auth-guard";
import CopyButton from "@/components/copy-button";
import { useAuth } from "@/hooks/useAuth";
import { addPlaylist, getPlaylists } from "@/lib/api";
import type { PlaylistData, ApiError, PlaylistType } from "@/types";

type Tab = PlaylistType;

function ManagePlaylistContent() {
  const { session } = useAuth(true);

  const [activeTab, setActiveTab] = useState<Tab>("m3u");
  const [m3uUrl, setM3uUrl] = useState("");
  const [xtreamUsername, setXtreamUsername] = useState("");
  const [xtreamPassword, setXtreamPassword] = useState("");
  const [xtreamServer, setXtreamServer] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [playlistLoading, setPlaylistLoading] = useState(true);
  const [playlistError, setPlaylistError] = useState("");

  useEffect(() => {
    if (!session) return;
    setPlaylistLoading(true);
    setPlaylistError("");

    getPlaylists(session.mac_address)
      .then((data) => {
        setPlaylists(data);

        const first = data[0];
        if (!first?.type) return;

        if (first.type === "m3u" && first.m3u_url) {
          setActiveTab("m3u");
          setM3uUrl(first.m3u_url);
        }

        if (first.type === "xtream") {
          setActiveTab("xtream");
          setXtreamUsername(first.xtream_username ?? "");
          setXtreamPassword(first.xtream_password ?? "");
          setXtreamServer(first.xtream_base_url ?? "");
        }
      })
      .catch((err: unknown) => {
        const apiErr = err as ApiError;
        setPlaylistError(apiErr.message || "Failed to load playlist.");
      })
      .finally(() => setPlaylistLoading(false));
  }, [session]);

  const currentPlaylist = playlists.find((item) => item.type === activeTab) ?? null;
  const hasExistingOfType = !!currentPlaylist;

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setFieldErrors({});

    const selected = playlists.find((item) => item.type === tab);
    if (!selected) return;

    if (tab === "m3u") {
      setM3uUrl(selected.m3u_url ?? "");
    } else {
      setXtreamUsername(selected.xtream_username ?? "");
      setXtreamPassword(selected.xtream_password ?? "");
      setXtreamServer(selected.xtream_base_url ?? "");
    }
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (activeTab === "m3u") {
      if (!m3uUrl.trim()) {
        errors.m3uUrl = "Playlist URL is required.";
      } else {
        try {
          new URL(m3uUrl.trim());
        } catch {
          errors.m3uUrl = "Please enter a valid URL.";
        }
      }
    } else {
      if (!xtreamUsername.trim()) errors.xtreamUsername = "Username is required.";
      if (!xtreamPassword.trim()) errors.xtreamPassword = "Password is required.";
      if (!xtreamServer.trim()) {
        errors.xtreamServer = "Server URL is required.";
      } else {
        try {
          new URL(xtreamServer.trim());
        } catch {
          errors.xtreamServer = "Please enter a valid server URL.";
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function refreshPlaylists() {
    if (!session) return;
    const updated = await getPlaylists(session.mac_address).catch(() => []);
    setPlaylists(updated);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;

    setError("");
    setSuccess("");

    if (!validate()) return;

    setSaving(true);

    try {
      if (activeTab === "m3u") {
        await addPlaylist(session.mac_address, session.device_key, {
          type: "m3u",
          m3u_url: m3uUrl.trim(),
        });
      } else {
        await addPlaylist(session.mac_address, session.device_key, {
          type: "xtream",
          xtream_username: xtreamUsername.trim(),
          xtream_password: xtreamPassword.trim(),
          xtream_base_url: xtreamServer.trim(),
        });
      }

      setSuccess(
        hasExistingOfType
          ? `Your ${activeTab.toUpperCase()} playlist has been updated successfully.`
          : `Your ${activeTab.toUpperCase()} playlist has been saved successfully.`
      );
      setFieldErrors({});
      await refreshPlaylists();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to save playlist. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!session) return null;

  return (
    <SectionWrapper
      title="Manage Playlist"
      subtitle="Add your own M3U URL or Xtream Codes details and manage them from the website."
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {playlistLoading ? (
          <Card>
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <p className="text-sm text-muted">Loading current playlists...</p>
            </div>
          </Card>
        ) : playlistError ? (
          <ErrorMessage message={playlistError} />
        ) : playlists.length > 0 ? (
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Saved Playlists</h3>
                <p className="mt-1 text-xs text-muted">
                  If your backend returns more than one saved playlist, each type is shown here.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {playlists.length} saved
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {playlists.map((playlist, index) => (
                <div
                  key={playlist.id ?? `${playlist.type}-${index}`}
                  className="rounded-xl border border-border bg-background/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {playlist.type?.toUpperCase() ?? "Playlist"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {playlist.type === activeTab
                          ? "Currently selected in the editor below."
                          : "Saved on this device."}
                      </p>
                    </div>
                    {playlist.type && (
                      <button
                        type="button"
                        onClick={() => switchTab(playlist.type)}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-white"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    {playlist.type === "m3u" && playlist.m3u_url && (
                      <div className="flex items-start justify-between gap-2 rounded-lg bg-surface px-3 py-2">
                        <div className="min-w-0">
                          <p className="text-xs text-muted">Playlist URL</p>
                          <p className="text-sm text-white break-all">{playlist.m3u_url}</p>
                        </div>
                        <CopyButton value={playlist.m3u_url} label="URL" className="mt-3 shrink-0" />
                      </div>
                    )}

                    {playlist.type === "xtream" && (
                      <>
                        {playlist.xtream_username && (
                          <div className="flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2">
                            <div>
                              <p className="text-xs text-muted">Username</p>
                              <p className="text-sm text-white">{playlist.xtream_username}</p>
                            </div>
                            <CopyButton value={playlist.xtream_username} label="Username" />
                          </div>
                        )}
                        {playlist.xtream_base_url && (
                          <div className="flex items-start justify-between gap-2 rounded-lg bg-surface px-3 py-2">
                            <div className="min-w-0">
                              <p className="text-xs text-muted">Server</p>
                              <p className="text-sm text-white break-all">{playlist.xtream_base_url}</p>
                            </div>
                            <CopyButton value={playlist.xtream_base_url} label="Server" className="mt-3 shrink-0" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
              </svg>
              <p className="text-sm font-medium text-white">No playlist added yet</p>
              <p className="text-xs text-muted">Use the form below to add your first playlist.</p>
            </div>
          </Card>
        )}

        <Card>
          <div className="mb-5 rounded-xl border border-primary/20 bg-primary/10 p-4">
            <h3 className="text-sm font-semibold text-white">Add your own playlist</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              Choose the format provided by your playlist source. You can save an M3U URL or Xtream Codes credentials.
            </p>
          </div>

          <div className="mb-6 flex rounded-xl bg-background p-1">
            <button
              type="button"
              onClick={() => switchTab("m3u")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                activeTab === "m3u" ? "bg-primary text-white" : "text-muted hover:text-white"
              }`}
            >
              M3U Playlist
            </button>
            <button
              type="button"
              onClick={() => switchTab("xtream")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                activeTab === "xtream" ? "bg-primary text-white" : "text-muted hover:text-white"
              }`}
            >
              Xtream Codes
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {activeTab === "m3u" ? (
              <div>
                <Input
                  label="Playlist URL"
                  name="m3uUrl"
                  placeholder="http://example.com/playlist.m3u"
                  value={m3uUrl}
                  onChange={(e) => {
                    setM3uUrl(e.target.value);
                    setFieldErrors((previous) => ({ ...previous, m3uUrl: "" }));
                  }}
                />
                <p className="mt-2 text-xs leading-6 text-muted">
                  Paste the direct M3U or M3U8 playlist URL supplied by your provider.
                </p>
                {fieldErrors.m3uUrl && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.m3uUrl}</p>
                )}
              </div>
            ) : (
              <>
                <div>
                  <Input
                    label="Username"
                    name="xtreamUsername"
                    placeholder="your_username"
                    value={xtreamUsername}
                    onChange={(e) => {
                      setXtreamUsername(e.target.value);
                      setFieldErrors((previous) => ({ ...previous, xtreamUsername: "" }));
                    }}
                  />
                  <p className="mt-2 text-xs leading-6 text-muted">
                    Enter the Xtream username exactly as provided.
                  </p>
                  {fieldErrors.xtreamUsername && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.xtreamUsername}</p>
                  )}
                </div>

                <div>
                  <Input
                    label="Password"
                    name="xtreamPassword"
                    type="password"
                    placeholder="your_password"
                    value={xtreamPassword}
                    onChange={(e) => {
                      setXtreamPassword(e.target.value);
                      setFieldErrors((previous) => ({ ...previous, xtreamPassword: "" }));
                    }}
                  />
                  <p className="mt-2 text-xs leading-6 text-muted">
                    Passwords are only used to store the playlist details you choose to save.
                  </p>
                  {fieldErrors.xtreamPassword && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.xtreamPassword}</p>
                  )}
                </div>

                <div>
                  <Input
                    label="Server URL"
                    name="xtreamServer"
                    placeholder="http://example.com:8080"
                    value={xtreamServer}
                    onChange={(e) => {
                      setXtreamServer(e.target.value);
                      setFieldErrors((previous) => ({ ...previous, xtreamServer: "" }));
                    }}
                  />
                  <p className="mt-2 text-xs leading-6 text-muted">
                    Include the full server address, for example <span className="text-white">http://example.com:8080</span>.
                  </p>
                  {fieldErrors.xtreamServer && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.xtreamServer}</p>
                  )}
                </div>
              </>
            )}

            {success && (
              <Toast message={success} type="success" onClose={() => setSuccess("")} />
            )}

            {error && (
              <Toast message={error} type="error" onClose={() => setError("")} />
            )}

            <div className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-muted">
              {hasExistingOfType
                ? `You already have a saved ${activeTab.toUpperCase()} playlist. Saving this form will update it.`
                : `No ${activeTab.toUpperCase()} playlist is saved yet for this device.`}
            </div>

            <Button type="submit" disabled={saving} className="w-full py-4">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Saving...
                </span>
              ) : hasExistingOfType ? (
                "Update Playlist"
              ) : (
                "Save Playlist"
              )}
            </Button>
          </form>
        </Card>

        <Button variant="outline" href="/dashboard" className="w-full">
          Back to Dashboard
        </Button>
      </div>
    </SectionWrapper>
  );
}

export default function ManagePlaylistPage() {
  return (
    <AuthGuard>
      <ManagePlaylistContent />
    </AuthGuard>
  );
}

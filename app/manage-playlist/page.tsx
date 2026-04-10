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
import { addPlaylist, getPlaylist } from "@/lib/api";
import type { PlaylistData, ApiError } from "@/types";

type Tab = "m3u" | "xtream";

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

  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistData | null>(null);
  const [playlistLoading, setPlaylistLoading] = useState(true);
  const [playlistError, setPlaylistError] = useState("");

  useEffect(() => {
    if (!session) return;
    setPlaylistLoading(true);
    setPlaylistError("");
    getPlaylist(session.mac_address)
      .then((data) => {
        setCurrentPlaylist(data);
        if (data && data.type) {
          if (data.type === "m3u" && data.m3u_url) {
            setActiveTab("m3u");
            setM3uUrl(data.m3u_url);
          } else if (data.type === "xtream") {
            setActiveTab("xtream");
            setXtreamUsername(data.xtream_username ?? "");
            setXtreamPassword(data.xtream_password ?? "");
            setXtreamServer(data.xtream_base_url ?? "");
          }
        }
      })
      .catch((err: unknown) => {
        const apiErr = err as ApiError;
        setPlaylistError(apiErr.message || "Failed to load playlist.");
      })
      .finally(() => setPlaylistLoading(false));
  }, [session]);

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
      setSuccess("Playlist saved successfully!");
      setFieldErrors({});
      const updated = await getPlaylist(session.mac_address).catch(() => null);
      setCurrentPlaylist(updated);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to save playlist. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!session) return null;

  return (
    <SectionWrapper title="Manage Playlist" subtitle="Add your M3U URL or Xtream Codes credentials.">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Current Playlist Info */}
        {playlistLoading ? (
          <Card>
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <p className="text-sm text-muted">Loading current playlist...</p>
            </div>
          </Card>
        ) : playlistError ? (
          <ErrorMessage message={playlistError} />
        ) : currentPlaylist && currentPlaylist.type ? (
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Current Playlist</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {currentPlaylist.type.toUpperCase()}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {currentPlaylist.type === "m3u" && currentPlaylist.m3u_url && (
                <div className="flex items-start justify-between gap-2 rounded-lg bg-background px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted">URL</p>
                    <p className="text-sm text-white break-all">{currentPlaylist.m3u_url}</p>
                  </div>
                  <CopyButton value={currentPlaylist.m3u_url} label="URL" className="shrink-0 mt-3" />
                </div>
              )}
              {currentPlaylist.type === "xtream" && (
                <>
                  {currentPlaylist.xtream_username && (
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-background px-3 py-2">
                      <div>
                        <p className="text-xs text-muted">Username</p>
                        <p className="text-sm text-white">{currentPlaylist.xtream_username}</p>
                      </div>
                      <CopyButton value={currentPlaylist.xtream_username} label="Username" />
                    </div>
                  )}
                  {currentPlaylist.xtream_base_url && (
                    <div className="flex items-start justify-between gap-2 rounded-lg bg-background px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted">Server</p>
                        <p className="text-sm text-white break-all">{currentPlaylist.xtream_base_url}</p>
                      </div>
                      <CopyButton value={currentPlaylist.xtream_base_url} label="Server" className="shrink-0 mt-3" />
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        ) : !playlistLoading ? (
          <Card>
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
              </svg>
              <p className="text-sm font-medium text-white">No playlist added yet</p>
              <p className="text-xs text-muted">Use the form below to add your first playlist.</p>
            </div>
          </Card>
        ) : null}

        <Card>
          {/* Tabs */}
          <div className="mb-6 flex rounded-xl bg-background p-1">
            <button
              type="button"
              onClick={() => { setActiveTab("m3u"); setFieldErrors({}); }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                activeTab === "m3u"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              M3U Playlist
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("xtream"); setFieldErrors({}); }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                activeTab === "xtream"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-white"
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
                  onChange={(e) => { setM3uUrl(e.target.value); setFieldErrors((p) => ({ ...p, m3uUrl: "" })); }}
                />
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
                    onChange={(e) => { setXtreamUsername(e.target.value); setFieldErrors((p) => ({ ...p, xtreamUsername: "" })); }}
                  />
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
                    onChange={(e) => { setXtreamPassword(e.target.value); setFieldErrors((p) => ({ ...p, xtreamPassword: "" })); }}
                  />
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
                    onChange={(e) => { setXtreamServer(e.target.value); setFieldErrors((p) => ({ ...p, xtreamServer: "" })); }}
                  />
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

            <Button type="submit" disabled={saving} className="w-full py-4">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Saving...
                </span>
              ) : currentPlaylist && currentPlaylist.type ? (
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

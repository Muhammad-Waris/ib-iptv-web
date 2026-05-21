"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
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
import {
  activatePlaylist,
  addPlaylist,
  deletePlaylist,
  getPlaylists,
  isActivePlaylist,
  updatePlaylist,
  type PlaylistId,
} from "@/lib/api";
import { notifyPlaylistsChanged } from "@/lib/playlist-events";
import type { PlaylistData, ApiError, PlaylistPayload, PlaylistType } from "@/types";

type FormMode = "add" | "edit";

interface PlaylistForm {
  name: string;
  providerUrl: string;
  type: PlaylistType;
  m3uUrl: string;
  xtreamBaseUrl: string;
  xtreamUsername: string;
  xtreamPassword: string;
}

const actionButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-surface-light disabled:pointer-events-none disabled:opacity-50";

const dangerButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10 disabled:pointer-events-none disabled:opacity-50";

const XTREAM_DETECTED_MESSAGE = "Xtream playlist detected and converted automatically.";
const XTREAM_PROVIDER_ENDPOINTS = new Set(["get.php", "player_api.php"]);

interface XtreamProviderDetails {
  baseUrl: string;
  username: string;
  password: string;
}

function createEmptyForm(type: PlaylistType = "m3u"): PlaylistForm {
  return {
    name: "",
    providerUrl: "",
    type,
    m3uUrl: "",
    xtreamBaseUrl: "",
    xtreamUsername: "",
    xtreamPassword: "",
  };
}

function getPlaylistId(playlist: PlaylistData): PlaylistId | null {
  return playlist.id ?? playlist._id ?? playlist.playlist_id ?? null;
}

function getPlaylistName(playlist: PlaylistData, index?: number): string {
  return (
    playlist.name ??
    playlist.title ??
    playlist.playlist_name ??
    `${playlist.type?.toUpperCase() ?? "Playlist"}${index != null ? ` ${index + 1}` : ""}`
  );
}

function getLastUpdated(playlist: PlaylistData): string | undefined {
  return playlist.updated_at ?? playlist.last_updated ?? playlist.created_at;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Not available";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function detectXtreamProviderUrl(value: string): XtreamProviderDetails | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  try {
    const url = new URL(trimmedValue);
    const username = url.searchParams.get("username")?.trim();
    const password = url.searchParams.get("password")?.trim();
    const pathnameParts = url.pathname.toLowerCase().split("/");
    const fileName = pathnameParts[pathnameParts.length - 1];

    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      !XTREAM_PROVIDER_ENDPOINTS.has(fileName) ||
      !username ||
      !password
    ) {
      return null;
    }

    return {
      baseUrl: url.origin,
      username,
      password,
    };
  } catch {
    return null;
  }
}

function buildXtreamProviderUrl(
  baseUrl?: string,
  username?: string,
  password?: string
): string {
  const trimmedBaseUrl = baseUrl?.trim().replace(/\/+$/, "") ?? "";
  const trimmedUsername = username?.trim() ?? "";
  const trimmedPassword = password?.trim() ?? "";

  if (!trimmedBaseUrl || !trimmedUsername || !trimmedPassword) return "";

  const params = new URLSearchParams({
    username: trimmedUsername,
    password: trimmedPassword,
    type: "m3u_plus",
    output: "ts",
  });

  return `${trimmedBaseUrl}/get.php?${params.toString()}`;
}

function getPlaylistProviderUrl(playlist: PlaylistData): string {
  if (playlist.type === "xtream") {
    return buildXtreamProviderUrl(
      playlist.xtream_base_url,
      playlist.xtream_username,
      playlist.xtream_password
    );
  }

  return playlist.m3u_url ?? "";
}

function getProviderUrlFromForm(form: PlaylistForm): string {
  if (form.type === "xtream") {
    return buildXtreamProviderUrl(
      form.xtreamBaseUrl,
      form.xtreamUsername,
      form.xtreamPassword
    );
  }

  return form.m3uUrl;
}

function normalizePlaylistForm(
  form: PlaylistForm,
  preferManualSetup: boolean
): {
  form: PlaylistForm;
  convertedXtream: boolean;
  source: "provider" | "manual";
} {
  const providerUrl = form.providerUrl.trim();

  if (!preferManualSetup && providerUrl) {
    const detected = detectXtreamProviderUrl(providerUrl);

    if (detected) {
      return {
        convertedXtream: true,
        source: "provider",
        form: {
          ...form,
          type: "xtream",
          m3uUrl: "",
          xtreamBaseUrl: detected.baseUrl,
          xtreamUsername: detected.username,
          xtreamPassword: detected.password,
        },
      };
    }

    return {
      convertedXtream: false,
      source: "provider",
      form: {
        ...form,
        type: "m3u",
        m3uUrl: providerUrl,
      },
    };
  }

  const manualUrl = form.type === "m3u" ? form.m3uUrl : form.xtreamBaseUrl;
  const detected = detectXtreamProviderUrl(manualUrl);
  if (!detected) {
    return { form, convertedXtream: false, source: "manual" };
  }

  return {
    convertedXtream: true,
    source: "manual",
    form: {
      ...form,
      providerUrl: buildXtreamProviderUrl(
        detected.baseUrl,
        detected.username,
        detected.password
      ),
      type: "xtream",
      m3uUrl: "",
      xtreamBaseUrl: detected.baseUrl,
      xtreamUsername: detected.username,
      xtreamPassword: detected.password,
    },
  };
}

function buildPayload(form: PlaylistForm): PlaylistPayload {
  const name = form.name.trim();

  if (form.type === "m3u") {
    return {
      type: "m3u",
      name,
      m3u_url: form.m3uUrl.trim(),
    };
  }

  return {
    type: "xtream",
    name,
    xtream_base_url: form.xtreamBaseUrl.trim(),
    xtream_username: form.xtreamUsername.trim(),
    xtream_password: form.xtreamPassword.trim(),
  };
}

function ManagePlaylistContent() {
  const { session } = useAuth(true);

  const [form, setForm] = useState<PlaylistForm>(() => createEmptyForm());
  const [mode, setMode] = useState<FormMode>("add");
  const [editingPlaylistId, setEditingPlaylistId] = useState<PlaylistId | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [manualSetupTouched, setManualSetupTouched] = useState(false);

  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [detectionMessage, setDetectionMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [playlistLoading, setPlaylistLoading] = useState(true);
  const [playlistError, setPlaylistError] = useState("");

  const loadPlaylists = useCallback(
    async (showLoading = false) => {
      if (!session) return [];

      if (showLoading) {
        setPlaylistLoading(true);
      }
      setPlaylistError("");

      try {
        const data = await getPlaylists(session.mac_address, session.device_key);
        setPlaylists(data);
        return data;
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        setPlaylistError(apiErr.message || "Failed to load playlists.");
        return [];
      } finally {
        if (showLoading) {
          setPlaylistLoading(false);
        }
      }
    },
    [session]
  );

  useEffect(() => {
    if (!session) return;
    void loadPlaylists(true);
  }, [session, loadPlaylists]);

  const activePlaylist = useMemo(
    () => playlists.find(isActivePlaylist) ?? null,
    [playlists]
  );

  function updateFormField(field: keyof PlaylistForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: "" }));
  }

  function updateManualFormField(field: keyof PlaylistForm, value: string) {
    setManualSetupTouched(true);
    setForm((previous) => {
      const updated = { ...previous, [field]: value };
      return {
        ...updated,
        providerUrl: getProviderUrlFromForm(updated),
      };
    });
    setFieldErrors((previous) => ({ ...previous, [field]: "", providerUrl: "" }));
  }

  function handleProviderUrlChange(value: string) {
    const normalized = normalizePlaylistForm({
      ...form,
      providerUrl: value,
    }, false);

    setManualSetupTouched(false);
    setForm(normalized.form);
    setFieldErrors((previous) => ({
      ...previous,
      providerUrl: "",
      m3uUrl: "",
      xtreamBaseUrl: "",
      xtreamUsername: "",
      xtreamPassword: "",
    }));

    if (normalized.convertedXtream) {
      setFieldErrors({});
      setDetectionMessage(XTREAM_DETECTED_MESSAGE);
      setSuccess(XTREAM_DETECTED_MESSAGE);
      setError("");
    } else {
      setDetectionMessage("");
    }
  }

  function handleManualM3uUrlChange(value: string) {
    const normalized = normalizePlaylistForm({
      ...form,
      type: "m3u",
      m3uUrl: value,
      providerUrl: value,
    }, true);

    setManualSetupTouched(true);
    setForm(normalized.form);
    setFieldErrors((previous) => ({ ...previous, m3uUrl: "", providerUrl: "" }));

    if (normalized.convertedXtream) {
      setFieldErrors({});
      setDetectionMessage(XTREAM_DETECTED_MESSAGE);
      setSuccess(XTREAM_DETECTED_MESSAGE);
      setError("");
    } else {
      setDetectionMessage("");
    }
  }

  function handleManualXtreamBaseUrlChange(value: string) {
    const normalized = normalizePlaylistForm({
      ...form,
      type: "xtream",
      xtreamBaseUrl: value,
    }, true);

    setManualSetupTouched(true);
    setForm((previous) => {
      const updated = normalized.convertedXtream
        ? normalized.form
        : { ...previous, type: "xtream" as const, xtreamBaseUrl: value };

      return {
        ...updated,
        providerUrl: getProviderUrlFromForm(updated),
      };
    });
    setFieldErrors((previous) => ({ ...previous, xtreamBaseUrl: "", providerUrl: "" }));

    if (normalized.convertedXtream) {
      setFieldErrors({});
      setDetectionMessage(XTREAM_DETECTED_MESSAGE);
      setSuccess(XTREAM_DETECTED_MESSAGE);
      setError("");
    } else {
      setDetectionMessage("");
    }
  }

  function startAdd(type: PlaylistType = form.type) {
    setMode("add");
    setEditingPlaylistId(null);
    setAdvancedOpen(false);
    setManualSetupTouched(false);
    setForm(createEmptyForm(type));
    setFieldErrors({});
    setDetectionMessage("");
    setError("");
    setSuccess("");
    document.getElementById("playlist-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function startEdit(playlist: PlaylistData, index: number) {
    const playlistId = getPlaylistId(playlist);
    if (!playlistId) {
      setError("This playlist cannot be edited because the backend did not return a playlist ID.");
      setSuccess("");
      return;
    }

    const type = playlist.type ?? "m3u";
    setMode("edit");
    setEditingPlaylistId(playlistId);
    setAdvancedOpen(false);
    setManualSetupTouched(false);
    setForm({
      name: getPlaylistName(playlist, index),
      providerUrl: getPlaylistProviderUrl(playlist),
      type,
      m3uUrl: playlist.m3u_url ?? "",
      xtreamBaseUrl: playlist.xtream_base_url ?? "",
      xtreamUsername: playlist.xtream_username ?? "",
      xtreamPassword: playlist.xtream_password ?? "",
    });
    setFieldErrors({});
    setDetectionMessage("");
    setError("");
    setSuccess("");
    document.getElementById("playlist-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function validate(
    targetForm: PlaylistForm = form,
    source: "provider" | "manual" = "manual"
  ): boolean {
    const errors: Record<string, string> = {};

    if (!targetForm.name.trim()) {
      errors.name = "Playlist name is required.";
    }

    if (source === "provider") {
      if (!targetForm.providerUrl.trim()) {
        errors.providerUrl = "Playlist / Provider URL is required.";
      } else if (targetForm.type === "m3u") {
        try {
          new URL(targetForm.providerUrl.trim());
        } catch {
          errors.providerUrl = "Please enter a valid playlist URL.";
        }
      }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    }

    if (targetForm.type === "m3u") {
      if (!targetForm.m3uUrl.trim()) {
        errors.m3uUrl = "M3U URL is required.";
      } else {
        try {
          new URL(targetForm.m3uUrl.trim());
        } catch {
          errors.m3uUrl = "Please enter a valid M3U URL.";
        }
      }
    } else {
      if (!targetForm.xtreamBaseUrl.trim()) {
        errors.xtreamBaseUrl = "Server URL is required.";
      } else {
        try {
          new URL(targetForm.xtreamBaseUrl.trim());
        } catch {
          errors.xtreamBaseUrl = "Please enter a valid server URL.";
        }
      }

      if (!targetForm.xtreamUsername.trim()) {
        errors.xtreamUsername = "Username is required.";
      }

      if (!targetForm.xtreamPassword.trim()) {
        errors.xtreamPassword = "Password is required.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return;

    setError("");
    setSuccess("");

    const normalized = normalizePlaylistForm(form, manualSetupTouched);
    if (normalized.convertedXtream) {
      setForm(normalized.form);
      setDetectionMessage(XTREAM_DETECTED_MESSAGE);
    }

    if (!validate(normalized.form, normalized.source)) return;

    if (mode === "edit" && !editingPlaylistId) {
      setError("Select a saved playlist before updating.");
      return;
    }

    setSaving(true);

    try {
      const payload = buildPayload(normalized.form);

      if (mode === "edit" && editingPlaylistId) {
        await updatePlaylist(
          editingPlaylistId,
          session.mac_address,
          session.device_key,
          payload
        );
        setSuccess(
          normalized.convertedXtream
            ? `${XTREAM_DETECTED_MESSAGE} Playlist updated successfully.`
            : "Playlist updated successfully."
        );
        setForm(normalized.form);
        setManualSetupTouched(false);
      } else {
        await addPlaylist(session.mac_address, session.device_key, payload);
        setSuccess(
          normalized.convertedXtream
            ? `${XTREAM_DETECTED_MESSAGE} Playlist added successfully.`
            : "Playlist added successfully."
        );
        setMode("add");
        setEditingPlaylistId(null);
        setAdvancedOpen(false);
        setManualSetupTouched(false);
        setForm(createEmptyForm(normalized.form.type));
      }

      setFieldErrors({});
      setDetectionMessage("");
      await loadPlaylists(false);
      notifyPlaylistsChanged();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to save playlist. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(playlist: PlaylistData, index: number) {
    if (!session) return;

    const playlistId = getPlaylistId(playlist);
    if (!playlistId) {
      setError("This playlist cannot be activated because the backend did not return a playlist ID.");
      setSuccess("");
      return;
    }

    const operationId = `activate:${playlistId}`;
    setActionId(operationId);
    setError("");
    setSuccess("");

    try {
      await activatePlaylist(playlistId, session.mac_address, session.device_key);
      setSuccess(`${getPlaylistName(playlist, index)} is now active.`);
      await loadPlaylists(false);
      notifyPlaylistsChanged();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to activate playlist. Please try again.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(playlist: PlaylistData, index: number) {
    if (!session) return;

    const playlistId = getPlaylistId(playlist);
    if (!playlistId) {
      setError("This playlist cannot be deleted because the backend did not return a playlist ID.");
      setSuccess("");
      return;
    }

    const playlistName = getPlaylistName(playlist, index);
    const confirmed = window.confirm(`Delete "${playlistName}"?`);
    if (!confirmed) return;

    const wasActive = isActivePlaylist(playlist);
    const nextPlaylist =
      wasActive
        ? playlists.find((candidate) => {
            const candidateId = getPlaylistId(candidate);
            return candidateId != null && String(candidateId) !== String(playlistId);
          }) ?? null
        : null;

    const operationId = `delete:${playlistId}`;
    setActionId(operationId);
    setError("");
    setSuccess("");

    try {
      await deletePlaylist(playlistId, session.mac_address, session.device_key);

      let activatedNextName = "";
      if (nextPlaylist) {
        const nextPlaylistId = getPlaylistId(nextPlaylist);
        if (nextPlaylistId) {
          try {
            await activatePlaylist(nextPlaylistId, session.mac_address, session.device_key);
            activatedNextName = getPlaylistName(nextPlaylist);
          } catch {
            activatedNextName = "";
          }
        }
      }

      if (String(editingPlaylistId) === String(playlistId)) {
        setMode("add");
        setEditingPlaylistId(null);
        setAdvancedOpen(false);
        setManualSetupTouched(false);
        setForm(createEmptyForm(form.type));
      }

      const refreshedPlaylists = await loadPlaylists(false);
      notifyPlaylistsChanged();

      if (wasActive) {
        const refreshedActivePlaylist = refreshedPlaylists.find(isActivePlaylist);
        const activeName = activatedNextName || (refreshedActivePlaylist ? getPlaylistName(refreshedActivePlaylist) : "");
        setSuccess(
          activeName
            ? `Playlist deleted successfully. ${activeName} is now active.`
            : "Playlist deleted successfully. No active playlist is selected."
        );
      } else {
        setSuccess("Playlist deleted successfully.");
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to delete playlist. Please try again.");
    } finally {
      setActionId(null);
    }
  }

  if (!session) return null;

  return (
    <SectionWrapper
      title="Manage Playlists"
      subtitle="Add, edit, and choose the active playlist for this device."
    >
      <div className="mx-auto max-w-5xl space-y-6">
        {success && (
          <Toast message={success} type="success" onClose={() => setSuccess("")} />
        )}

        {error && (
          <Toast message={error} type="error" onClose={() => setError("")} />
        )}

        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Saved Playlists</h3>
              <p className="mt-1 text-sm text-muted">
                {playlists.length} saved
                {activePlaylist ? `, ${getPlaylistName(activePlaylist)} active` : ""}
              </p>
            </div>
            <Button onClick={() => startAdd()} className="w-full sm:w-auto">
              Add New
            </Button>
          </div>

          <div className="mt-5">
            {playlistLoading ? (
              <div className="flex items-center gap-3">
                <Spinner size="sm" />
                <p className="text-sm text-muted">Loading playlists...</p>
              </div>
            ) : playlistError ? (
              <ErrorMessage message={playlistError} onRetry={() => void loadPlaylists(true)} />
            ) : playlists.length > 0 ? (
              <div className="grid gap-4">
                {playlists.map((playlist, index) => {
                  const playlistId = getPlaylistId(playlist);
                  const isActive = isActivePlaylist(playlist);
                  const name = getPlaylistName(playlist, index);
                  const type = playlist.type?.toUpperCase() ?? "Playlist";
                  const activateActionId = `activate:${playlistId}`;
                  const deleteActionId = `delete:${playlistId}`;

                  return (
                    <div
                      key={playlistId ?? `${playlist.type ?? "playlist"}-${index}`}
                      className={`rounded-xl border bg-background/70 p-4 ${
                        isActive ? "border-primary/70 ring-1 ring-primary/30" : "border-border"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-semibold text-white break-all">
                              {name}
                            </h4>
                            <span className="rounded-full bg-surface-light px-2.5 py-0.5 text-xs font-semibold text-muted">
                              {type}
                            </span>
                            {isActive && (
                              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted">
                            Last updated: {formatDate(getLastUpdated(playlist))}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(playlist, index)}
                            disabled={!playlistId || !!actionId || saving}
                            className={actionButtonClass}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleActivate(playlist, index)}
                            disabled={!playlistId || isActive || !!actionId || saving}
                            className={actionButtonClass}
                          >
                            {actionId === activateActionId ? "Activating..." : "Set Active"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(playlist, index)}
                            disabled={!playlistId || !!actionId || saving}
                            className={dangerButtonClass}
                          >
                            {actionId === deleteActionId ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {playlist.type === "m3u" && playlist.m3u_url && (
                          <div className="rounded-lg bg-surface px-3 py-2 sm:col-span-2">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted">
                              M3U URL
                            </p>
                            <div className="mt-1 flex items-start gap-2">
                              <p className="min-w-0 flex-1 break-all text-sm font-semibold text-white">
                                {playlist.m3u_url}
                              </p>
                              <CopyButton value={playlist.m3u_url} label="URL" className="shrink-0" />
                            </div>
                          </div>
                        )}

                        {playlist.type === "xtream" && (
                          <>
                            {playlist.xtream_username && (
                              <PlaylistDetail
                                label="Username"
                                value={playlist.xtream_username}
                                copyLabel="Username"
                              />
                            )}
                            {playlist.xtream_base_url && (
                              <PlaylistDetail
                                label="Server"
                                value={playlist.xtream_base_url}
                                copyLabel="Server"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-8 text-center">
                <p className="text-sm font-semibold text-white">No playlists saved yet</p>
                <p className="mt-1 text-xs text-muted">Add the first playlist below.</p>
              </div>
            )}
          </div>
        </Card>

        <Card id="playlist-form">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {mode === "edit" ? "Edit Playlist" : "Add New Playlist"}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {mode === "edit" ? "Updating a saved playlist." : "This creates a separate playlist entry."}
              </p>
            </div>
            {mode === "edit" && (
              <Button variant="outline" onClick={() => startAdd()} className="w-full sm:w-auto">
                Add New
              </Button>
            )}
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <Input
                label="Playlist Name"
                name="playlistName"
                placeholder="Main IPTV"
                value={form.name}
                onChange={(e) => updateFormField("name", e.target.value)}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <Input
                label="Playlist / Provider URL"
                name="providerUrl"
                placeholder="http://example.com/get.php?username=xxx&password=yyy&type=m3u_plus&output=ts"
                value={form.providerUrl}
                onChange={(e) => handleProviderUrlChange(e.target.value)}
              />
              {fieldErrors.providerUrl && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.providerUrl}</p>
              )}
            </div>

            {detectionMessage && (
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400">
                {detectionMessage}
              </div>
            )}

            <div className="border-t border-border pt-5">
              <button
                type="button"
                aria-expanded={advancedOpen}
                onClick={() => setAdvancedOpen((previous) => !previous)}
                className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-white transition-colors hover:text-primary"
              >
                <span>Advanced / Manual Setup</span>
                <span className="text-xs text-muted">
                  {advancedOpen ? "Hide" : "Show"}
                </span>
              </button>

              {advancedOpen && (
                <div className="mt-4 flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-background p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setManualSetupTouched(true);
                        setForm((previous) => {
                          const updated = { ...previous, type: "m3u" as const };
                          return {
                            ...updated,
                            providerUrl: getProviderUrlFromForm(updated),
                          };
                        });
                        setFieldErrors({});
                        setDetectionMessage("");
                      }}
                      className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                        form.type === "m3u" ? "bg-primary text-white" : "text-muted hover:text-white"
                      }`}
                    >
                      M3U
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setManualSetupTouched(true);
                        setForm((previous) => {
                          const updated = { ...previous, type: "xtream" as const };
                          return {
                            ...updated,
                            providerUrl: getProviderUrlFromForm(updated),
                          };
                        });
                        setFieldErrors({});
                        setDetectionMessage("");
                      }}
                      className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                        form.type === "xtream" ? "bg-primary text-white" : "text-muted hover:text-white"
                      }`}
                    >
                      Xtream
                    </button>
                  </div>

                  {form.type === "m3u" ? (
                    <div>
                      <Input
                        label="M3U URL"
                        name="m3uUrl"
                        placeholder="https://example.com/playlist.m3u"
                        value={form.m3uUrl}
                        onChange={(e) => handleManualM3uUrlChange(e.target.value)}
                      />
                      {fieldErrors.m3uUrl && (
                        <p className="mt-1 text-xs text-red-400">{fieldErrors.m3uUrl}</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div>
                        <Input
                          label="Xtream Server URL"
                          name="xtreamBaseUrl"
                          placeholder="https://example.com:8080"
                          value={form.xtreamBaseUrl}
                          onChange={(e) => handleManualXtreamBaseUrlChange(e.target.value)}
                        />
                        {fieldErrors.xtreamBaseUrl && (
                          <p className="mt-1 text-xs text-red-400">{fieldErrors.xtreamBaseUrl}</p>
                        )}
                      </div>

                      <div>
                        <Input
                          label="Username"
                          name="xtreamUsername"
                          placeholder="username"
                          value={form.xtreamUsername}
                          onChange={(e) => updateManualFormField("xtreamUsername", e.target.value)}
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
                          placeholder="password"
                          value={form.xtreamPassword}
                          onChange={(e) => updateManualFormField("xtreamPassword", e.target.value)}
                        />
                        {fieldErrors.xtreamPassword && (
                          <p className="mt-1 text-xs text-red-400">{fieldErrors.xtreamPassword}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" disabled={saving || !!actionId} className="w-full py-4">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Saving...
                </span>
              ) : mode === "edit" ? (
                "Update Playlist"
              ) : (
                "Add Playlist"
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

function PlaylistDetail({
  label,
  value,
  copyLabel,
}: {
  label: string;
  value: string;
  copyLabel: string;
}) {
  return (
    <div className="rounded-lg bg-surface px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <div className="mt-1 flex items-start gap-2">
        <p className="min-w-0 flex-1 break-all text-sm font-semibold text-white">
          {value}
        </p>
        <CopyButton value={value} label={copyLabel} className="shrink-0" />
      </div>
    </div>
  );
}

export default function ManagePlaylistPage() {
  return (
    <AuthGuard>
      <ManagePlaylistContent />
    </AuthGuard>
  );
}

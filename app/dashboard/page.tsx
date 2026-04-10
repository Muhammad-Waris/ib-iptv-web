"use client";

import { useEffect, useState, useCallback } from "react";
import Card from "@/components/card";
import Button from "@/components/button";
import SectionWrapper from "@/components/section-wrapper";
import { SkeletonCard } from "@/components/skeleton";
import ErrorMessage from "@/components/error-message";
import AuthGuard from "@/components/auth-guard";
import CopyButton from "@/components/copy-button";
import { useAuth } from "@/hooks/useAuth";
import { getDeviceStatus, getPlaylist } from "@/lib/api";
import type { DeviceStatus, PlaylistData, ApiError } from "@/types";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function capitalize(str: string): string {
  if (!str) return "—";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function DashboardContent() {
  const { session, logout } = useAuth(true);

  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (mac: string) => {
    setLoading(true);
    setError("");
    try {
      const [deviceStatus, playlistData] = await Promise.all([
        getDeviceStatus(mac),
        getPlaylist(mac).catch(() => null),
      ]);
      setStatus(deviceStatus);
      setPlaylist(playlistData);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to load device status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchData(session.mac_address);
    }
  }, [session, fetchData]);

  if (!session) return null;

  const isExpired = status && !status.is_active;
  const hasPlaylist = playlist && playlist.type;

  return (
    <SectionWrapper title="Dashboard" subtitle={`Device — ${session.mac_address}`}>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Expired Subscription Banner */}
        {!loading && isExpired && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-red-500/30 bg-red-500/5 px-6 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Your Subscription Has Expired</h3>
              <p className="mt-1 text-sm text-muted">
                Renew your plan to continue enjoying IPTV Player on your device.
              </p>
            </div>
            <Button href="/checkout?plan=yearly" className="px-8">
              Renew Subscription
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => fetchData(session.mac_address)} />
        ) : (
          <>
            {/* Subscription Details */}
            <Card>
              <h3 className="mb-4 text-lg font-semibold text-white">
                Subscription Details
              </h3>
              {status ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted">
                      MAC Address
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white break-all">
                        {session.mac_address}
                      </span>
                      <CopyButton value={session.mac_address} label="MAC" />
                    </div>
                  </div>
                  <InfoRow
                    label="Status"
                    value={status.is_active ? "Active" : "Expired"}
                    badge={status.is_active ? "active" : "expired"}
                  />
                  <InfoRow label="Plan" value={capitalize(status.plan)} />
                  <InfoRow label="Expires" value={formatDate(status.expires_at)} />
                  <InfoRow
                    label="Days Remaining"
                    value={
                      status.days_remaining != null && status.days_remaining > 0
                        ? `${status.days_remaining} days`
                        : status.is_active
                          ? "Unlimited"
                          : "0 days"
                    }
                  />
                </div>
              ) : (
                <p className="text-sm text-muted">No subscription data available.</p>
              )}
            </Card>

            {/* Current Playlist */}
            {hasPlaylist ? (
              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Current Playlist
                  </h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {playlist.type!.toUpperCase()}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {playlist.type === "m3u" && playlist.m3u_url && (
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted">
                        Playlist URL
                      </span>
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-semibold text-white break-all">
                          {playlist.m3u_url}
                        </span>
                        <CopyButton value={playlist.m3u_url} label="URL" className="shrink-0" />
                      </div>
                    </div>
                  )}
                  {playlist.type === "xtream" && (
                    <>
                      {playlist.xtream_username && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted">
                            Username
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {playlist.xtream_username}
                            </span>
                            <CopyButton value={playlist.xtream_username} label="Username" />
                          </div>
                        </div>
                      )}
                      {playlist.xtream_base_url && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted">
                            Server
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white break-all">
                              {playlist.xtream_base_url}
                            </span>
                            <CopyButton value={playlist.xtream_base_url} label="Server" className="shrink-0" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <Button href="/manage-playlist" variant="outline" className="text-xs">
                    Edit Playlist
                  </Button>
                </div>
              </Card>
            ) : !loading ? (
              <Card>
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-light">
                    <svg className="h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">No Playlist Added Yet</h3>
                    <p className="mt-1 text-xs text-muted">
                      Add your M3U URL or Xtream Codes to start streaming.
                    </p>
                  </div>
                  <Button href="/manage-playlist" className="text-xs">
                    Add Playlist
                  </Button>
                </div>
              </Card>
            ) : null}
          </>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/manage-playlist" className="flex-1 py-4">
            {hasPlaylist ? "Edit Playlist" : "Add Playlist"}
          </Button>
          {isExpired && (
            <Button variant="secondary" href="/checkout?plan=yearly" className="flex-1 py-4">
              Renew Plan
            </Button>
          )}
          <Button variant="outline" onClick={logout} className="flex-1 py-4">
            Logout
          </Button>
        </div>

        {/* Plan Cards — only show when subscription is expired/inactive */}
        {!loading && isExpired && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Available Plans</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <PlanCard
                name="Free Trial"
                price="Free"
                duration="7 days"
                href="/checkout?plan=trial"
                current={status?.plan === "trial"}
              />
              <PlanCard
                name="Yearly"
                price="€8"
                duration="12 months"
                href="/checkout?plan=yearly"
                highlighted
                current={status?.plan === "yearly" && !!status?.is_active}
              />
              <PlanCard
                name="Lifetime"
                price="€12"
                duration="Forever"
                href="/checkout?plan=lifetime"
                current={status?.plan === "lifetime" && !!status?.is_active}
              />
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function InfoRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: "active" | "expired";
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      {badge ? (
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            badge === "active"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {value}
        </span>
      ) : (
        <span className="text-sm font-semibold text-white break-all">{value}</span>
      )}
    </div>
  );
}

function PlanCard({
  name,
  price,
  duration,
  href,
  highlighted,
  current,
}: {
  name: string;
  price: string;
  duration: string;
  href: string;
  highlighted?: boolean;
  current?: boolean;
}) {
  return (
    <Card
      className={`flex flex-col items-center text-center ${
        highlighted ? "border-primary ring-1 ring-primary" : ""
      } ${current ? "opacity-60" : "transition-transform hover:-translate-y-0.5"}`}
    >
      <h4 className="text-sm font-semibold text-white">{name}</h4>
      <p className="mt-1 text-2xl font-extrabold text-primary">{price}</p>
      <p className="mt-1 text-xs text-muted">{duration}</p>
      {current ? (
        <span className="mt-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Current Plan
        </span>
      ) : (
        <Button href={href} variant={highlighted ? "primary" : "outline"} className="mt-4 w-full text-xs">
          Select
        </Button>
      )}
    </Card>
  );
}

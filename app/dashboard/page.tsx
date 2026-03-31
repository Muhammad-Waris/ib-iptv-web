"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import Button from "@/components/button";
import Input from "@/components/input";
import SectionWrapper from "@/components/section-wrapper";
import { getSession, clearSession } from "@/lib/auth";
import { DEFAULT_SUBSCRIPTION } from "@/lib/mock-data";

const subscribe = () => () => {};

export default function DashboardPage() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribe, getSession, () => null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"1year" | "lifetime">("1year");
  const [planName, setPlanName] = useState("");
  const [planEmail, setPlanEmail] = useState("");
  const [planSubmitted, setPlanSubmitted] = useState(false);

  useEffect(() => {
    if (!session || !session.loggedIn) {
      router.push("/activate-device");
    }
  }, [session, router]);

  function handleLogout() {
    clearSession();
    router.push("/activate-device");
  }

  function handlePlanSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!planName.trim() || !planEmail.trim()) return;
    setPlanSubmitted(true);
  }

  if (!session || !session.loggedIn) {
    return (
      <SectionWrapper>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted">Loading...</p>
        </div>
      </SectionWrapper>
    );
  }

  const sub = DEFAULT_SUBSCRIPTION;

  return (
    <SectionWrapper title="Dashboard" subtitle={`Welcome back — ${session.mac}`}>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Subscription Info */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Subscription Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow label="MAC Address" value={session.mac} />
            <InfoRow label="Status" value={sub.status} />
            <InfoRow label="Plan" value={sub.plan} />
            <InfoRow label="Expiry Date" value={sub.expiryDate} />
            <InfoRow
              label="Trial Days Remaining"
              value={`${sub.trialDaysRemaining} days`}
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/manage-playlist" className="flex-1 py-4">
            Manage Playlist
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowPlanForm(!showPlanForm)}
            className="flex-1 py-4"
          >
            {showPlanForm ? "Hide Plan Options" : "Activate Plan"}
          </Button>
          <Button variant="outline" onClick={handleLogout} className="flex-1 py-4">
            Logout
          </Button>
        </div>

        {/* Activate Plan Form */}
        {showPlanForm && (
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-white">Activate a Plan</h3>

            {planSubmitted ? (
              <div className="rounded-lg bg-green-500/10 px-4 py-6 text-center">
                <p className="text-sm font-medium text-green-400">
                  Your activation request has been submitted! We will process it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePlanSubmit} className="flex flex-col gap-5">
                {/* Plan Selection */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-muted">Select Plan</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan("1year")}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                        selectedPlan === "1year"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-muted hover:border-primary/50"
                      }`}
                    >
                      1 Year — 8€
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan("lifetime")}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                        selectedPlan === "lifetime"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-muted hover:border-primary/50"
                      }`}
                    >
                      Lifetime — 12€
                    </button>
                  </div>
                </div>

                <Input
                  label="Full Name"
                  name="planName"
                  placeholder="John Doe"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
                <Input
                  label="Email"
                  name="planEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={planEmail}
                  onChange={(e) => setPlanEmail(e.target.value)}
                />

                <Button type="submit" className="w-full py-4">
                  Submit Activation Request
                </Button>

                <p className="text-center text-xs text-muted">
                  Payment is processed manually. You will receive instructions via email.
                </p>
              </form>
            )}
          </Card>
        )}
      </div>
    </SectionWrapper>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

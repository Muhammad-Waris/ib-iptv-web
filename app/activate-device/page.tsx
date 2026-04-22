"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import Button from "@/components/button";
import Input from "@/components/input";
import SectionWrapper from "@/components/section-wrapper";
import Spinner from "@/components/spinner";
import { registerDevice } from "@/lib/api";
import type { ApiError } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export default function ActivateDevicePage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [mac, setMac] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <SectionWrapper>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedMac = mac.trim().toUpperCase();
    const trimmedKey = key.trim();

    if (!trimmedMac || !trimmedKey) {
      setError("Enter both your MAC address and your device key to continue.");
      return;
    }

    if (!/^\d+$/.test(trimmedKey)) {
      setError("Device key must contain numbers only.");
      return;
    }

    setLoading(true);

    try {
      await registerDevice(trimmedMac, trimmedKey);
      login({ mac_address: trimmedMac, device_key: trimmedKey });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionWrapper
      title="Activate Your Device"
      subtitle="Sign in with the MAC address and numeric device key shown inside the app."
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="h-fit">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Before you start
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Activation takes less than a minute.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Open the app on your device and keep the home screen visible. You will need the
              MAC address and the numeric device key exactly as shown there.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <h3 className="text-sm font-semibold text-white">Where to find your details</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                In the app, open the main screen or settings screen. Your MAC address and device key
                are displayed there for activation.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <h3 className="text-sm font-semibold text-white">Device key format</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                Device keys are numeric-only. Example: <span className="font-semibold text-white">123456</span>
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <h3 className="text-sm font-semibold text-white">What happens next</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                After activation, you will land on your dashboard where you can review status and add your playlist.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-semibold text-white">Website Activation</h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                Use the same device details shown in the app. We keep the flow simple so you can get to your playlist setup quickly.
              </p>
            </div>
            <Input
              label="MAC Address"
              name="mac"
              placeholder="AA:BB:CC:DD:EE:FF"
              value={mac}
              onChange={(e) => setMac(e.target.value)}
            />
            <Input
              label="Device Key"
              name="key"
              placeholder="123456"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <p className="-mt-2 text-xs text-muted">
              Device key must be numeric-only.
            </p>

            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="mt-2 w-full py-4">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs leading-6 text-muted">
            This website activates the player only. You will add your own playlist after login.
          </p>
        </Card>
      </div>
    </SectionWrapper>
  );
}

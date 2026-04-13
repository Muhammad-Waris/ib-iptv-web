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

  // Redirect to dashboard if already logged in
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
      setError("Please enter both MAC Address and Device Key.");
      return;
    }

    if (!/^[A-Za-z0-9]+$/.test(trimmedKey)) {
      setError("Invalid Device Key format.");
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
    <SectionWrapper title="Activate Your Device" subtitle="Enter your MAC Address and Device Key to get started.">
      <div className="mx-auto max-w-md">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
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

          <p className="mt-6 text-center text-xs text-muted">
            Find your MAC Address and Device Key in the app settings on your device.
          </p>
        </Card>
      </div>
    </SectionWrapper>
  );
}

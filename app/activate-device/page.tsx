"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import Button from "@/components/button";
import Input from "@/components/input";
import SectionWrapper from "@/components/section-wrapper";
import { VALID_MAC, VALID_KEY } from "@/lib/mock-data";
import { saveSession } from "@/lib/auth";

export default function ActivateDevicePage() {
  const router = useRouter();
  const [mac, setMac] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!mac.trim() || !key.trim()) {
      setError("Please enter both MAC Address and Device Key.");
      return;
    }

    if (!/^\d+$/.test(key)) {
      setError("Device Key must contain numbers only.");
      return;
    }

    setLoading(true);

    // Mock validation with delay
    setTimeout(() => {
      if (
        mac.trim().toUpperCase() === VALID_MAC.toUpperCase() &&
        key.trim() === VALID_KEY
      ) {
        saveSession({ mac: mac.trim().toUpperCase(), key: key.trim(), loggedIn: true });
        router.push("/dashboard");
      } else {
        setError("Invalid MAC Address or Device Key. Please try again.");
        setLoading(false);
      }
    }, 800);
  }

  return (
    <SectionWrapper title="Activate Your Device" subtitle="Enter your MAC Address and Device Key to get started.">
      <div className="mx-auto max-w-md">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="MAC Address"
              name="mac"
              placeholder="00:1A:2B:3C:4D"
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
              {loading ? "Logging in..." : "Login"}
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

"use client";

import { useState } from "react";
import Card from "@/components/card";
import Button from "@/components/button";
import Input from "@/components/input";
import SectionWrapper from "@/components/section-wrapper";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    // Placeholder-only UI until a real support endpoint or CRM integration is added.
    setSubmitted(true);
  }

  return (
    <SectionWrapper
      title="Support and Contact"
      subtitle="Use this page for manual activation requests, setup help, and general support."
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="h-fit">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Support flow
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">Manual help is available.</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              If you need help with activation, a playlist setup question, or a future paid plan request,
              contact support and include your MAC address plus the device you are using.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <h3 className="text-sm font-semibold text-white">Best information to include</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                MAC address, numeric device key, device type, selected plan if relevant, and a short description of the issue.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <h3 className="text-sm font-semibold text-white">What support can help with</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                Device activation, playlist setup guidance, manual plan requests, and general onboarding help.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <h3 className="text-sm font-semibold text-white">Product reminder</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                This product is a media player and playlist manager only. It does not provide channels or playlists.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          {submitted ? (
            <div className="rounded-lg bg-green-500/10 px-4 py-8 text-center">
              <svg
                className="mx-auto mb-3 h-10 w-10 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-green-400">
                Message captured in the UI. Connect this form to your real support backend or email service next.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-semibold text-white">Send a support request</h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  The form UI is ready for backend integration. Until then, it acts as a placeholder for the future support workflow.
                </p>
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Message"
                name="message"
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                textarea
                rows={5}
              />

              <div className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-muted">
                Manual activation tip: include your MAC address and the plan you want help with if your message is about activation.
              </div>

              <Button type="submit" className="w-full py-4">
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </SectionWrapper>
  );
}

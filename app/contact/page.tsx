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
    setSubmitted(true);
  }

  return (
    <SectionWrapper title="Contact Us" subtitle="Have a question or need help? Send us a message.">
      <div className="mx-auto max-w-md">
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
                Message sent! We&apos;ll get back to you as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

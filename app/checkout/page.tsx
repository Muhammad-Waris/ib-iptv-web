"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/card";
import Button from "@/components/button";
import SectionWrapper from "@/components/section-wrapper";
import AuthGuard from "@/components/auth-guard";
import { useAuth } from "@/hooks/useAuth";

const PLANS: Record<string, { name: string; price: string; features: string[] }> = {
  trial: {
    name: "Free Access",
    price: "Free",
    features: [
      "Current default option",
      "Start free",
      "Manual support available",
      "No checkout required right now",
    ],
  },
  yearly: {
    name: "1 Year Plan",
    price: "€8.00",
    features: [
      "Future paid plan",
      "Manual activation support",
      "Device-linked plan request",
      "Checkout integration can be added later",
    ],
  },
  lifetime: {
    name: "Lifetime Plan",
    price: "€12.00",
    features: [
      "Future paid plan",
      "Manual activation support",
      "One-time setup style plan",
      "Kept visible for later rollout",
    ],
  },
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAuth(true);

  const planKey = searchParams.get("plan") || "yearly";
  const plan = PLANS[planKey];

  useEffect(() => {
    if (!plan) {
      router.push("/dashboard");
    }
  }, [plan, router]);

  if (!plan) return null;

  return (
    <SectionWrapper
      title="Plan Request"
      subtitle="Review your selected plan and contact support if manual activation is needed."
    >
      <div className="mx-auto max-w-lg space-y-6">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <span className="text-2xl font-extrabold text-primary">{plan.price}</span>
          </div>
          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </Card>

        {session && (
          <Card className="bg-surface-light/50">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Selected device</p>
            <p className="mt-3 text-sm text-muted">
              MAC address: <span className="font-semibold text-white">{session.mac_address}</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              Device key: <span className="font-semibold text-white">{session.device_key}</span>
            </p>
          </Card>
        )}

        <Card className="border-primary/20 bg-primary/10">
          <p className="text-sm font-medium text-white">
            For now, plan activation is handled manually.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            Contact support with your MAC address and selected plan. This keeps the page future-ready for Stripe or Lemon Squeezy later,
            while matching the current manual support workflow.
          </p>
        </Card>

        <Card className="border-dashed">
          <h3 className="text-sm font-semibold text-white">Current rollout note</h3>
          <p className="mt-3 text-sm leading-7 text-muted">
            Free access is the main current path. Paid plans remain listed here for visibility and future rollout, but checkout is not enforced today.
          </p>
        </Card>

        <div className="space-y-3">
          <Button href="/contact" className="w-full py-4">
            Contact Support
          </Button>
          <Button variant="outline" href="/dashboard" className="w-full">
            Go Back to Dashboard
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}

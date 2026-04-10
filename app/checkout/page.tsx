"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/card";
import Button from "@/components/button";
import SectionWrapper from "@/components/section-wrapper";
import Spinner from "@/components/spinner";
import Toast from "@/components/toast";
import AuthGuard from "@/components/auth-guard";
import { useAuth } from "@/hooks/useAuth";
import { activateSubscription } from "@/lib/api";
import type { ApiError } from "@/types";

const PLANS: Record<string, { name: string; price: string; features: string[] }> = {
  trial: {
    name: "7-Day Free Trial",
    price: "Free",
    features: ["Full access for 7 days", "All devices", "HD streaming", "No payment required"],
  },
  yearly: {
    name: "1 Year Plan",
    price: "€8.00",
    features: ["Full access for 12 months", "All devices", "HD & 4K streaming", "Priority support"],
  },
  lifetime: {
    name: "Lifetime Plan",
    price: "€12.00",
    features: ["Unlimited access forever", "All devices", "HD & 4K streaming", "Priority support", "No renewal needed"],
  },
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAuth(true);

  const planKey = searchParams.get("plan") || "yearly";
  const plan = PLANS[planKey];

  const [step, setStep] = useState<"review" | "processing" | "success" | "error">("review");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!plan) {
      router.push("/dashboard");
    }
  }, [plan, router]);

  async function handlePayment() {
    if (!session) return;

    setStep("processing");
    setError("");

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await activateSubscription(
        session.mac_address,
        session.device_key,
        planKey as "trial" | "yearly" | "lifetime"
      );
      setStep("success");
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Payment failed. Please try again.");
      setStep("error");
    }
  }

  if (!plan) return null;

  return (
    <SectionWrapper title="Checkout" subtitle="Review your plan and complete your purchase.">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Plan Summary */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <span className="text-2xl font-extrabold text-primary">{plan.price}</span>
          </div>
          <ul className="space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted">
                <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </Card>

        {/* Device Info */}
        {session && (
          <Card className="bg-surface-light/50">
            <p className="text-xs text-muted">
              Activating for device:{" "}
              <span className="font-semibold text-white">{session.mac_address}</span>
            </p>
          </Card>
        )}

        {/* Status  */}
        {step === "review" && (
          <div className="space-y-3">
            {planKey === "trial" ? (
              <Button onClick={handlePayment} className="w-full py-4">
                Start Free Trial
              </Button>
            ) : (
              <>
                {/* Placeholder for Stripe — shows a mock card UI */}
                <Card className="border-dashed">
                  <div className="flex items-center gap-3">
                    <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-white">Payment</p>
                      <p className="text-xs text-muted">Stripe integration coming soon. Simulating payment for now.</p>
                    </div>
                  </div>
                </Card>
                <Button onClick={handlePayment} className="w-full py-4">
                  Pay {plan.price}
                </Button>
              </>
            )}
            <Button variant="outline" href="/dashboard" className="w-full">
              Cancel
            </Button>
          </div>
        )}

        {step === "processing" && (
          <Card>
            <div className="flex flex-col items-center gap-4 py-6">
              <Spinner size="lg" />
              <p className="text-sm text-muted">Processing your payment...</p>
            </div>
          </Card>
        )}

        {step === "success" && (
          <div className="space-y-4">
            <Card>
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                  <svg className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Payment Successful!</h3>
                <p className="text-sm text-muted">Your {plan.name} has been activated.</p>
              </div>
            </Card>
            <Button href="/dashboard" className="w-full py-4">
              Go to Dashboard
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-4">
            <Toast message={error} type="error" onClose={() => setStep("review")} />
            <Button onClick={() => setStep("review")} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}
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

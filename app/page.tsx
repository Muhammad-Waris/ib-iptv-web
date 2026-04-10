import Button from "@/components/button";
import Card from "@/components/card";
import SectionWrapper from "@/components/section-wrapper";
import { FEATURES, PRICING_PLANS, FAQ_ITEMS } from "@/lib/mock-data";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-15" />
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Stream Smarter,{" "}
            <span className="text-primary">Watch Better</span>
          </h1>
          <p className="mt-6 text-lg text-muted sm:text-xl">
            The ultimate IPTV platform with seamless device activation, playlist
            management, and high-quality streaming on all your devices.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/activate-device" className="w-full sm:w-auto px-8 py-4 text-base">
              Activate Device
            </Button>
            <Button
              href="/download"
              variant="outline"
              className="w-full sm:w-auto px-8 py-4 text-base"
            >
              Download App
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <SectionWrapper title="Why Choose IPTV Player?" subtitle="Everything you need for the best IPTV experience.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="text-center transition-transform hover:-translate-y-1 hover:border-primary/50">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FeatureIcon name={feature.icon} />
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.description}</p>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Pricing Section */}
      <SectionWrapper
        title="Simple Pricing"
        subtitle="Start free, upgrade anytime."
        className="bg-surface"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col text-center transition-transform hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-primary ring-1 ring-primary"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-4xl font-extrabold text-white">
                {plan.price}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-muted">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href={plan.name === "Lifetime" ? "/checkout?plan=lifetime" : plan.name === "1 Year" ? "/checkout?plan=yearly" : "/checkout?plan=trial"}
                variant={plan.highlighted ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                {plan.price === "Free" ? "Start Free Trial" : "Get Started"}
              </Button>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQ Section */}
      <SectionWrapper title="Frequently Asked Questions" subtitle="Got questions? We have answers.">
        <div className="mx-auto max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item) => (
            <Card key={item.question}>
              <h3 className="text-base font-semibold text-white">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.answer}
              </p>
            </Card>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}

function FeatureIcon({ name }: { name: string }) {
  switch (name) {
    case "layout":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
    case "zap":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "devices":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "play":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" />
        </svg>
      );
    default:
      return null;
  }
}

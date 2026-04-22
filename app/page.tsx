import Button from "@/components/button";
import Card from "@/components/card";
import SectionWrapper from "@/components/section-wrapper";
import {
  FEATURES,
  PRICING_PLANS,
  FAQ_ITEMS,
  HOW_IT_WORKS_STEPS,
  TRUST_CARDS,
} from "@/lib/mock-data";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.24),_transparent_45%)]" />
        <div className="absolute inset-x-0 top-20 -z-10 mx-auto h-80 max-w-6xl rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Free To Start
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Activate your media player fast and manage playlists from one clean dashboard.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Set up Android TV, Firestick, Samsung TV, and Windows devices with a website
              built for quick activation, smooth playlist management, and a simple free-to-start flow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted">
              <span className="rounded-full border border-border bg-surface px-4 py-2">Fast device activation</span>
              <span className="rounded-full border border-border bg-surface px-4 py-2">M3U and Xtream support</span>
              <span className="rounded-full border border-border bg-surface px-4 py-2">Manual support available</span>
            </div>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Button href="/activate-device" className="w-full px-8 py-4 text-base sm:w-auto">
                Activate Device
              </Button>
              <Button
                href="/download"
                variant="outline"
                className="w-full px-8 py-4 text-base sm:w-auto"
              >
                Download App
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted">
              Paid plans remain visible for future rollout, but the current website experience is designed to let users start free.
            </p>
          </div>

          <Card className="relative overflow-hidden border-primary/20 bg-surface/90">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="grid gap-4">
              <div className="rounded-2xl border border-border bg-background/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Product flow
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Install the app on your device",
                    "Open it to view MAC address and device key",
                    "Activate on the website",
                    "Add your own playlist and start streaming",
                  ].map((item, index) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-sm text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="rounded-2xl border border-border bg-background/60 p-4">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FeatureIcon name={feature.icon} />
                    </div>
                    <h2 className="text-base font-semibold text-white">{feature.title}</h2>
                    <p className="mt-2 text-sm text-muted">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <SectionWrapper
        title="How It Works"
        subtitle="A simple setup flow built for living-room devices and quick playlist management."
      >
        <div className="grid gap-5 lg:grid-cols-5">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <Card key={item.step} className="relative h-full transition-transform hover:-translate-y-1 hover:border-primary/40">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Step {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Built Around Real Product Needs"
        subtitle="Trust-style product highlights without fake reviews, hype, or content-provider claims."
        className="bg-surface"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_CARDS.map((card) => (
            <Card key={card.title} className="transition-transform hover:-translate-y-1 hover:border-primary/50">
              <p className="text-sm font-medium text-muted">{card.title}</p>
              <p className="mt-4 text-3xl font-extrabold text-white">{card.value}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{card.description}</p>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Pricing"
        subtitle="Start free now. Keep future paid plans visible without making payment a requirement."
        className="bg-surface"
      >
        <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-primary/20 bg-primary/10 px-6 py-5 text-center">
          <p className="text-sm font-medium text-white">
            Free access is the recommended current path.
          </p>
          <p className="mt-2 text-sm leading-7 text-muted">
            Users can get started for free, while yearly and lifetime plans remain visible for future rollout.
            If manual activation or support is needed, the contact page is the current fallback.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col text-center transition-transform hover:-translate-y-1 ${
                plan.highlighted ? "border-primary ring-1 ring-primary" : ""
              }`}
            >
              {plan.badge && (
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-4xl font-extrabold text-white">{plan.price}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-6 text-muted">{plan.note}</p>
              <Button
                href={plan.href}
                variant={plan.highlighted ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                {plan.ctaLabel}
              </Button>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Checkout stays available as a future-ready plan page, but manual support currently handles paid-plan questions.
        </p>
      </SectionWrapper>

      <SectionWrapper
        title="Frequently Asked Questions"
        subtitle="Clear answers about activation, playlists, and what this product is designed to do."
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item) => (
            <Card key={item.question}>
              <h3 className="text-base font-semibold text-white">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.answer}</p>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="pt-0">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-surface px-6 py-6 text-center">
          <h2 className="text-lg font-semibold text-white">Legal Notice</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            This website and app are for media-player activation and playlist management only.
            They do not provide channels, playlists, or media content. Users are responsible for the
            playlist sources and content they choose to access.
          </p>
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

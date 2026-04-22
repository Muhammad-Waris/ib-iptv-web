import Card from "@/components/card";
import Button from "@/components/button";
import SectionWrapper from "@/components/section-wrapper";

const APK_URL = ""; // Replace with a real download URL when the app build is ready.

const PLATFORMS = [
  {
    id: "android-tv",
    name: "Android TV",
    icon: "android",
    description:
      "Works on Android TV boxes, Chromecast with Google TV, Shield-style devices, and similar setups.",
    downloadLabel: "Download APK",
    downloadUrl: APK_URL,
    steps: [
      "Download the APK on your Android TV or move it over using USB or local transfer.",
      "Open the APK with a file manager.",
      "Allow installation from unknown sources if prompted.",
      "Launch the app and note the MAC address and device key shown on screen.",
    ],
  },
  {
    id: "firestick",
    name: "Amazon Firestick",
    icon: "firestick",
    description:
      "Compatible with Firestick Lite, 4K, 4K Max, and other Fire TV devices.",
    downloadLabel: "Sideload Guide",
    steps: [
      "Open Settings, then My Fire TV and Developer Options.",
      "Enable install from unknown apps.",
      "Install Downloader from the Amazon Appstore.",
      "Use Downloader with the final app link when it is available, then open the app to get your MAC and key.",
    ],
  },
  {
    id: "samsung",
    name: "Samsung TV",
    icon: "samsung",
    description:
      "For Samsung Smart TVs with a Tizen-based app installation flow.",
    downloadLabel: "Installation Guide",
    steps: [
      "Open the Samsung app store on your TV.",
      "Search for the player if it is published for your region.",
      "Install and launch the app.",
      "Use the home screen details shown in the app to activate your device on the website.",
    ],
  },
  {
    id: "windows",
    name: "Windows",
    icon: "windows",
    description:
      "A desktop-friendly setup path for Windows PCs and laptops.",
    downloadLabel: "Download for Windows",
    downloadUrl: APK_URL,
    steps: [
      "Download the Windows installer when it is available.",
      "Run the installer and complete the setup steps.",
      "Open the app from the Start menu or desktop.",
      "Use the MAC address and device key shown in the app to activate the device on the website.",
    ],
  },
];

export default function DownloadPage() {
  return (
    <>
      <SectionWrapper
        title="Download the Media Player"
        subtitle="Choose your device, follow the setup steps, and then activate it from the website."
      >
        <div className="mx-auto max-w-5xl space-y-8">
          <Card className="border-primary/20 bg-primary/10">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Step 1</p>
                <p className="mt-2 text-sm font-semibold text-white">Install the app</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Use the platform guide below to install or prepare your device.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Step 2</p>
                <p className="mt-2 text-sm font-semibold text-white">Get MAC + key</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Open the app and note the MAC address and device key shown on screen.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Step 3</p>
                <p className="mt-2 text-sm font-semibold text-white">Activate and add playlist</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Use the website to activate the device and save your playlist details.
                </p>
              </div>
            </div>
          </Card>

          {PLATFORMS.map((platform) => (
            <Card key={platform.id} id={platform.id} className="overflow-hidden">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex items-start gap-4 sm:w-72 sm:shrink-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <DeviceIcon name={platform.icon} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{platform.name}</h3>
                    <p className="mt-1 text-sm text-muted">{platform.description}</p>
                    {platform.downloadUrl ? (
                      <Button href={platform.downloadUrl} className="mt-3 text-xs">
                        {platform.downloadLabel}
                      </Button>
                    ) : (
                      <div className="mt-3 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                        Download link will be added soon
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="mb-3 text-sm font-semibold text-white">
                    Installation Steps
                  </h4>
                  <ol className="grid gap-3 sm:grid-cols-2">
                    {platform.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 rounded-xl border border-border bg-background/60 p-3 text-sm text-muted">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-surface">
        <div className="mx-auto max-w-md text-center">
          <h3 className="text-xl font-bold text-white">Quick Access Placeholder</h3>
          <p className="mt-2 text-sm text-muted">
            A real QR download asset can be dropped in later. For now, use the platform instructions above.
          </p>
          <div className="mt-6 inline-flex rounded-2xl border border-border bg-white p-4">
            <svg className="h-40 w-40 text-black" viewBox="0 0 200 200" fill="currentColor">
              <rect x="10" y="10" width="60" height="60" rx="4" />
              <rect x="20" y="20" width="40" height="40" rx="2" fill="white" />
              <rect x="30" y="30" width="20" height="20" rx="1" />
              <rect x="130" y="10" width="60" height="60" rx="4" />
              <rect x="140" y="20" width="40" height="40" rx="2" fill="white" />
              <rect x="150" y="30" width="20" height="20" rx="1" />
              <rect x="10" y="130" width="60" height="60" rx="4" />
              <rect x="20" y="140" width="40" height="40" rx="2" fill="white" />
              <rect x="30" y="150" width="20" height="20" rx="1" />
              <rect x="80" y="10" width="10" height="10" />
              <rect x="100" y="10" width="10" height="10" />
              <rect x="80" y="30" width="10" height="10" />
              <rect x="100" y="40" width="10" height="10" />
              <rect x="80" y="80" width="10" height="10" />
              <rect x="90" y="90" width="10" height="10" />
              <rect x="100" y="80" width="10" height="10" />
              <rect x="130" y="80" width="10" height="10" />
              <rect x="150" y="90" width="10" height="10" />
              <rect x="170" y="80" width="10" height="10" />
              <rect x="80" y="130" width="10" height="10" />
              <rect x="80" y="150" width="10" height="10" />
              <rect x="100" y="140" width="10" height="10" />
              <rect x="130" y="130" width="10" height="10" />
              <rect x="150" y="140" width="10" height="10" />
              <rect x="170" y="150" width="10" height="10" />
              <rect x="130" y="170" width="10" height="10" />
              <rect x="160" y="170" width="10" height="10" />
            </svg>
          </div>
          <p className="mt-4 text-xs text-muted">
            Replace this placeholder with a real hosted QR image when download URLs are finalized.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-xl font-bold text-white">Need Help?</h3>
          <p className="mt-2 text-sm text-muted">
            After installing, activate your device on the website using your MAC address and device key, then add your playlist.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/how-to-activate">How to Activate</Button>
            <Button href="/how-to-add-playlist" variant="outline">
              How to Add Playlist
            </Button>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}

function DeviceIcon({ name }: { name: string }) {
  switch (name) {
    case "android":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 16V8a7 7 0 0 1 14 0v8" />
          <rect x="3" y="16" width="18" height="4" rx="1" />
          <path d="M7 4l-2-2" />
          <path d="M17 4l2-2" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      );
    case "firestick":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "samsung":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="13" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "windows":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 5.5l7-1v7H3z" />
          <path d="M11 4.2l9-1.5v8.8h-9z" />
          <path d="M3 12.5h7v7l-7-1z" />
          <path d="M11 12.5h9v8.8l-9-1.5z" />
        </svg>
      );
    default:
      return null;
  }
}

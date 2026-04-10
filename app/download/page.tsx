import Card from "@/components/card";
import Button from "@/components/button";
import SectionWrapper from "@/components/section-wrapper";

const APK_URL = "#"; // Replace with real APK URL when available

const PLATFORMS = [
  {
    id: "android-tv",
    name: "Android TV",
    icon: "android",
    description: "Works on Nvidia Shield, Xiaomi Mi Box, Chromecast with Google TV, and all Android TV devices.",
    downloadLabel: "Download APK",
    downloadUrl: APK_URL,
    steps: [
      "Download the APK file on your Android TV or transfer it via USB.",
      "Open the APK file using a file manager (e.g., File Commander).",
      "If prompted, allow installation from unknown sources in Settings > Security.",
      "Install and open IPTV Player. Your MAC address and device key will be shown on the home screen.",
    ],
  },
  {
    id: "firestick",
    name: "Amazon Firestick",
    icon: "firestick",
    description: "Compatible with Firestick Lite, 4K, 4K Max, and Fire TV Cube.",
    downloadLabel: "Sideload Guide",
    steps: [
      "On your Firestick, go to Settings > My Fire TV > Developer Options.",
      "Enable \"Apps from Unknown Sources\" (or \"Install unknown apps\").",
      "Install the Downloader app from the Amazon Appstore.",
      "Open Downloader and enter the APK download URL.",
      "Download and install IPTV Player. Open it to find your MAC address and device key.",
    ],
  },
  {
    id: "samsung",
    name: "Samsung Smart TV",
    icon: "samsung",
    description: "Supports Samsung Smart TVs running Tizen OS (2017 and newer).",
    downloadLabel: "Installation Guide",
    steps: [
      "On your Samsung TV, open the Smart Hub (app store).",
      "Search for \"IPTV Player\" in the search bar.",
      "Install the app and open it.",
      "Your MAC address and device key will be displayed on the home screen.",
      "If the app is not available in your region, contact support for alternative installation.",
    ],
  },
  {
    id: "windows",
    name: "Windows PC",
    icon: "windows",
    description: "Runs on Windows 10 and Windows 11 PCs and laptops.",
    downloadLabel: "Download for Windows",
    downloadUrl: APK_URL,
    steps: [
      "Download the IPTV Player installer (.exe) for Windows.",
      "Run the installer and follow the on-screen steps.",
      "Once installed, open IPTV Player from your desktop or Start menu.",
      "Your MAC address and device key will appear on the home screen.",
    ],
  },
];

export default function DownloadPage() {
  return (
    <>
      <SectionWrapper
        title="Download IPTV Player"
        subtitle="Get started in minutes. Choose your platform below."
      >
        <div className="mx-auto max-w-4xl space-y-8">
          {PLATFORMS.map((platform) => (
            <Card key={platform.id} id={platform.id}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {/* Icon + Info */}
                <div className="flex items-start gap-4 sm:w-72 sm:shrink-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <DeviceIcon name={platform.icon} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{platform.name}</h3>
                    <p className="mt-1 text-sm text-muted">{platform.description}</p>
                    {platform.downloadUrl && (
                      <Button
                        href={platform.downloadUrl}
                        className="mt-3 text-xs"
                      >
                        {platform.downloadLabel}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Steps */}
                <div className="flex-1">
                  <h4 className="mb-3 text-sm font-semibold text-white">
                    Installation Steps
                  </h4>
                  <ol className="space-y-2">
                    {platform.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted">
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

      {/* QR Code Section */}
      <SectionWrapper className="bg-surface">
        <div className="mx-auto max-w-md text-center">
          <h3 className="text-xl font-bold text-white">Scan to Download</h3>
          <p className="mt-2 text-sm text-muted">
            Scan this QR code from your phone to download the APK directly.
          </p>
          <div className="mt-6 inline-flex rounded-2xl border border-border bg-white p-4">
            {/* QR Code placeholder — replace with real QR image */}
            <svg
              className="h-40 w-40 text-black"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              {/* Simplified QR pattern */}
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
            Or visit this page on your device&apos;s browser.
          </p>
        </div>
      </SectionWrapper>

      {/* Help Section */}
      <SectionWrapper>
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-xl font-bold text-white">Need Help?</h3>
          <p className="mt-2 text-sm text-muted">
            After installing, activate your device on our website using your MAC address and device key.
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
          <path d="M7 4l-2-2" /><path d="M17 4l2-2" />
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

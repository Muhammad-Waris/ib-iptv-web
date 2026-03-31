import Card from "@/components/card";
import Button from "@/components/button";
import SectionWrapper from "@/components/section-wrapper";
import { SUPPORTED_DEVICES } from "@/lib/mock-data";

export default function DownloadPage() {
  return (
    <SectionWrapper
      title="Download IPTV Player"
      subtitle="Available on all major platforms. Choose your device below."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SUPPORTED_DEVICES.map((device) => (
          <Card
            key={device.name}
            className="flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <DeviceIcon name={device.icon} />
            </div>
            <h3 className="text-lg font-semibold text-white">{device.name}</h3>
            <p className="mt-2 flex-1 text-sm text-muted">{device.description}</p>
            <Button variant="outline" className="mt-6 w-full">
              Download
            </Button>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}

function DeviceIcon({ name }: { name: string }) {
  switch (name) {
    case "android":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 16V8a7 7 0 0 1 14 0v8" />
          <rect x="3" y="16" width="18" height="4" rx="1" />
          <path d="M7 4l-2-2" /><path d="M17 4l2-2" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      );
    case "firestick":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "samsung":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="13" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "windows":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

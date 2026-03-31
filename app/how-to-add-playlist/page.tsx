import Card from "@/components/card";
import SectionWrapper from "@/components/section-wrapper";

const STEPS = [
  {
    step: 1,
    title: "Activate Your Device",
    description:
      'First, make sure your device is activated. Go to the "Activate Device" page and log in with your MAC Address and Device Key.',
  },
  {
    step: 2,
    title: "Open Your Dashboard",
    description:
      'After logging in, you will be taken to your Dashboard. Click the "Manage Playlist" button.',
  },
  {
    step: 3,
    title: "Choose Playlist Type",
    description:
      "Select either M3U Playlist or Xtream Codes depending on which format your IPTV provider gave you.",
  },
  {
    step: 4,
    title: "Enter Your Playlist Details",
    description:
      "For M3U: Paste your playlist URL. For Xtream Codes: Enter your username, password, and server URL provided by your IPTV service.",
  },
  {
    step: 5,
    title: "Save and Enjoy",
    description:
      'Click "Save Playlist" and return to your device. Restart the app if needed. Your channels and content will now appear in the player.',
  },
];

export default function HowToAddPlaylistPage() {
  return (
    <SectionWrapper
      title="How to Add a Playlist"
      subtitle="Learn how to add your M3U URL or Xtream Codes to IPTV Player."
    >
      <div className="mx-auto max-w-2xl space-y-4">
        {STEPS.map((item) => (
          <Card key={item.step} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
              {item.step}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}

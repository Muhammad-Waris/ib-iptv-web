import Card from "@/components/card";
import SectionWrapper from "@/components/section-wrapper";

const STEPS = [
  {
    step: 1,
    title: "Install IPTV Player",
    description:
      "Download and install IPTV Player on your device from our Download page. Available for Android TV, Firestick, Samsung TV, and Windows.",
  },
  {
    step: 2,
    title: "Open the App",
    description:
      "Launch IPTV Player on your device. On the home screen, you will see your MAC Address and Device Key displayed.",
  },
  {
    step: 3,
    title: "Note Your Credentials",
    description:
      'Write down or remember your MAC Address (e.g., 00:1A:2B:3C:4D) and Device Key (e.g., 123456). You will need these to activate your device.',
  },
  {
    step: 4,
    title: "Go to Activate Device",
    description:
      'Visit our website and navigate to the "Activate Device" page. Enter your MAC Address and Device Key in the form.',
  },
  {
    step: 5,
    title: "Login and Start Streaming",
    description:
      'Click "Login" to activate your device. You will be redirected to your dashboard where you can manage your subscription and playlists.',
  },
];

export default function HowToActivatePage() {
  return (
    <SectionWrapper
      title="How to Activate Your Device"
      subtitle="Follow these simple steps to get started with IPTV Player."
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

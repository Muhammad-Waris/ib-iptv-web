export const PRICING_PLANS = [
  {
    name: "Free",
    price: "Free",
    features: [
      "Free to start right now",
      "Device activation from the website",
      "Playlist management included",
      "Manual support available when needed",
    ],
    highlighted: true,
    ctaLabel: "Start Free",
    href: "/activate-device",
    badge: "Recommended",
    note: "Current default access mode while paid plans are being prepared.",
  },
  {
    name: "1 Year",
    price: "€8",
    features: [
      "Planned paid option",
      "Long-term access setup",
      "Manual activation support",
      "Future online checkout ready",
    ],
    highlighted: false,
    ctaLabel: "View Plan",
    href: "/checkout?plan=yearly",
    badge: "Future Option",
    note: "Available later or through manual support arrangements.",
  },
  {
    name: "Lifetime",
    price: "€12",
    features: [
      "Planned one-time upgrade",
      "No renewal style access",
      "Manual activation support",
      "Kept visible for future rollout",
    ],
    highlighted: false,
    ctaLabel: "View Plan",
    href: "/checkout?plan=lifetime",
    badge: "Future Option",
    note: "Shown for future pricing visibility while the product stays free to start.",
  },
];

export const FEATURES = [
  {
    title: "Easy Activation",
    description:
      "Get a device online quickly with a simple MAC address and device key workflow.",
    icon: "layout",
  },
  {
    title: "Playlist Management",
    description:
      "Add or update M3U and Xtream credentials from the website without touching app settings.",
    icon: "zap",
  },
  {
    title: "Multi-Device Support",
    description:
      "Built for Android TV, Firestick, Samsung TV, and Windows with a familiar setup flow.",
    icon: "devices",
  },
  {
    title: "Smooth Playback",
    description:
      "Designed to pair a clean media-player experience with your own playlist source.",
    icon: "play",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Does this media player provide channels or playlists?",
    answer:
      "No. This website and app are for device activation and playlist management only. You must use your own playlist or provider details.",
  },
  {
    question: "How do I activate my device?",
    answer:
      'Install the app, open it to get your MAC address and numeric device key, then sign in on the "Activate Device" page.',
  },
  {
    question: "How do I add my playlist?",
    answer:
      'After activation, open "Manage Playlist" in your dashboard. You can save an M3U URL or Xtream Codes credentials there.',
  },
  {
    question: "What devices are supported?",
    answer:
      "Android TV, Amazon Firestick, Samsung Smart TV, and Windows are all supported in the current website flow.",
  },
  {
    question: "Is the app free right now?",
    answer:
      "Yes. Free access is the main current flow. Paid plans stay visible for future rollout, and manual support is available if you need help.",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Install the app",
    description:
      "Download the player on your preferred device and launch it for the first time.",
  },
  {
    step: "02",
    title: "Find your device details",
    description:
      "Open the app home screen to view your MAC address and numeric device key.",
  },
  {
    step: "03",
    title: "Activate on the website",
    description:
      "Use the Activate Device page to sign in your device in a few seconds.",
  },
  {
    step: "04",
    title: "Add your playlist",
    description:
      "Save your M3U URL or Xtream Codes credentials from the website dashboard.",
  },
  {
    step: "05",
    title: "Start streaming",
    description:
      "Return to the app and enjoy playback using the playlist you added yourself.",
  },
];

export const TRUST_CARDS = [
  {
    title: "Easy activation",
    value: "MAC + Key",
    description:
      "A straightforward login flow built around the device credentials shown inside the app.",
  },
  {
    title: "Multi-device support",
    value: "4 platforms",
    description:
      "Android TV, Firestick, Samsung TV, and Windows all have dedicated setup guidance.",
  },
  {
    title: "Playlist management",
    value: "M3U + Xtream",
    description:
      "Store and update playlist details from the website instead of retyping them on the TV.",
  },
  {
    title: "Smooth playback",
    value: "Player-first",
    description:
      "The product focuses on being a clean media player and playlist manager, not a content provider.",
  },
];

export const SUPPORTED_DEVICES = [
  {
    name: "Android TV",
    description:
      "Compatible with common Android TV boxes and streaming devices, including Chromecast and Shield-style setups.",
    icon: "android",
  },
  {
    name: "Amazon Firestick",
    description:
      "Works with Fire TV hardware through a guided sideload-style installation flow.",
    icon: "firestick",
  },
  {
    name: "Samsung Smart TV",
    description:
      "Designed for Samsung Smart TV users who want a simple activation and playlist workflow.",
    icon: "samsung",
  },
  {
    name: "Windows",
    description:
      "A desktop-friendly option for users who want the same device management experience on Windows.",
    icon: "windows",
  },
];

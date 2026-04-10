export const PRICING_PLANS = [
  {
    name: "7 Days Free Trial",
    price: "Free",
    features: ["Full access", "All devices", "HD streaming", "No credit card needed"],
    highlighted: false,
  },
  {
    name: "1 Year",
    price: "8€",
    features: ["Full access", "All devices", "HD streaming", "Priority support"],
    highlighted: true,
  },
  {
    name: "Lifetime",
    price: "12€",
    features: ["Full access", "All devices", "HD streaming", "Priority support", "No renewal"],
    highlighted: false,
  },
];

export const FEATURES = [
  {
    title: "Simple UI",
    description: "Clean and intuitive interface designed for seamless navigation on any device.",
    icon: "layout",
  },
  {
    title: "Fast Activation",
    description: "Get started in seconds with our quick MAC address activation process.",
    icon: "zap",
  },
  {
    title: "Multi-Device Support",
    description: "Works on Android TV, Firestick, Samsung TV, Windows, and more.",
    icon: "devices",
  },
  {
    title: "High-Quality Streaming",
    description: "Enjoy buffer-free HD and 4K streaming with optimized playback.",
    icon: "play",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Does IPTV Player provide playlists or channels?",
    answer:
      "No. IPTV Player is an application only. We do not provide, host, or distribute any playlists, channels, or media content. You must add your own playlist from your own IPTV provider.",
  },
  {
    question: "How do I add my playlist?",
    answer:
      'After activating your device, go to "Manage Playlist" in your dashboard. You can add an M3U URL or enter your Xtream Codes credentials (username, password, server URL).',
  },
  {
    question: "What devices are supported?",
    answer:
      "IPTV Player supports Android TV, Amazon Firestick, Samsung Smart TV, and Windows. Download the app from our Download page.",
  },
  {
    question: "Is IPTV Player responsible for the content I stream?",
    answer:
      "No. IPTV Player is a media player application only. We have no control over and take no responsibility for any content accessed through third-party playlists. Users are solely responsible for the content they stream.",
  },
  {
    question: "How does the free trial work?",
    answer:
      "The 7-day free trial gives you full access to all features. No credit card is required. After the trial ends, you can choose a yearly or lifetime plan.",
  },
];

export const SUPPORTED_DEVICES = [
  {
    name: "Android TV",
    description: "Compatible with all Android TV devices including Nvidia Shield, Xiaomi Mi Box, and more.",
    icon: "android",
  },
  {
    name: "Amazon Firestick",
    description: "Works on all Amazon Fire TV devices including Firestick 4K and Fire TV Cube.",
    icon: "firestick",
  },
  {
    name: "Samsung Smart TV",
    description: "Supports Samsung Smart TVs running Tizen OS (2017 and newer models).",
    icon: "samsung",
  },
  {
    name: "Windows",
    description: "Available for Windows 10 and Windows 11 PCs and laptops.",
    icon: "windows",
  },
];

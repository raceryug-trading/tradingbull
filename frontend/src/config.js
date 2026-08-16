// ============================================================================
// EDIT THIS FILE to customize your Trading Academy website.
// After changing, commit + push -> GitHub Pages will rebuild automatically.
// ============================================================================

export const BRAND = {
  name: "Your Trading Academy",
  tagline: "Master the Markets. Trade with Edge.",
  whatsappNumber: "+91XXXXXXXXXX", // include country code, no spaces (used in wa.me link)
  whatsappMessage: "Hi! I want to know more about your Trading Course.",
};

// Default admin & student accounts (loaded on first visit only, then editable via Admin Panel).
export const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
};

export const DEFAULT_STUDENTS = [
  { username: "student", password: "student123", name: "Demo Student" },
];

// Default course modules & lessons (edit or manage from Admin Panel)
export const DEFAULT_MODULES = [
  {
    id: "mod-basics",
    title: "Market Basics",
    description: "Foundations of stock market, indices, and order types.",
    lessons: [
      {
        id: "les-1",
        title: "What is the Stock Market?",
        youtubeUrl: "https://www.youtube.com/watch?v=p7HKvqRI_Bo",
        duration: "12:34",
      },
      {
        id: "les-2",
        title: "Order Types Explained",
        youtubeUrl: "https://www.youtube.com/watch?v=Xn7KWR9EOGQ",
        duration: "09:20",
      },
    ],
  },
  {
    id: "mod-technical",
    title: "Technical Analysis",
    description: "Candlesticks, patterns, indicators, and chart reading.",
    lessons: [
      {
        id: "les-3",
        title: "Candlestick Patterns 101",
        youtubeUrl: "https://www.youtube.com/watch?v=Sn-C_Gj0ZEQ",
        duration: "18:12",
      },
    ],
  },
  {
    id: "mod-options",
    title: "Options Trading",
    description: "Calls, puts, strategies, and risk management.",
    lessons: [
      {
        id: "les-4",
        title: "Options Basics: Calls & Puts",
        youtubeUrl: "https://www.youtube.com/watch?v=SuTGobDBqe4",
        duration: "22:05",
      },
    ],
  },
];

export const DEFAULT_LIVE = {
  url: "",
  title: "Weekly Market Outlook",
  isLive: false,
};

export const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Welcome to Your Trading Academy",
    body: "Check the Live Session tab every weekend for our market outlook.",
    tone: "info",
    createdAt: new Date().toISOString(),
  },
];

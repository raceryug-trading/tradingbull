// ============================================================================
// EDIT THIS FILE to customize your Trading Academy website.
// After changing, commit + push -> GitHub Pages will rebuild automatically.
// ============================================================================

export const BRAND = {
  name: "Trading Bulls Academy",
  tagline: "Master the Markets. Trade with Edge.",
  whatsappNumber: "+917777930377", // include country code, no spaces (used in wa.me link)
  whatsappMessage: "Hi! I want to know more about your Trading Course.",
};

// Public-facing stats shown on the landing page (edit freely)
export const STATS = {
  enrollments: "400+",
  rating: "4.9",
  topics: "36+",
  modules: "19+",
};

// Curriculum preview shown to visitors BEFORE they log in.
// Edit titles + topics freely. Total topic count drives the stat card.
export const CURRICULUM = [
  { title: "Stock Market Basics", topics: ["What is the stock market", "Primary vs secondary market"] },
  { title: "Indices Explained", topics: ["NIFTY, SENSEX & BANKNIFTY", "Sector indices"] },
  { title: "Broker Accounts & Orders", topics: ["Demat & trading accounts", "Order types: market, limit, SL"] },
  { title: "Candlestick Patterns", topics: ["Single & multi-candle patterns", "Reversal vs continuation"] },
  { title: "Chart Timeframes", topics: ["Intraday to positional", "Multi-timeframe analysis"] },
  { title: "Support & Resistance", topics: ["Drawing key zones", "Trading breakouts"] },
  { title: "Trend Analysis", topics: ["Trendlines & channels", "Trend reversal signals"] },
  { title: "Moving Averages", topics: ["SMA, EMA & crossovers", "MACD indicator"] },
  { title: "Momentum Indicators", topics: ["RSI & divergences", "Stochastic oscillator"] },
  { title: "Volume Analysis", topics: ["Volume spikes & confirmation", "VWAP for intraday"] },
  { title: "Fibonacci Tools", topics: ["Retracements & extensions", "Fib in real setups"] },
  { title: "Options Basics", topics: ["Calls, puts & premium", "In/Out/At the money"] },
  { title: "Options Greeks", topics: ["Delta, Gamma, Theta", "Vega & IV crush"] },
  { title: "Options Strategies", topics: ["Straddle & strangle", "Iron condor & spreads"] },
  { title: "Futures Trading", topics: ["Futures vs options", "Margin & rollover"] },
  { title: "Risk Management", topics: ["Position sizing", "Stop loss placement"] },
  { title: "Trading Psychology", topics: ["Fear, greed & discipline", "Journaling trades"] },
  { title: "Building a Trading Plan", topics: ["Setup, rules & routines", "Backtesting your edge"] },
  { title: "Live Trading Setup", topics: ["Broker platforms", "Executing your first live trade"] },
];

// Testimonials shown below the curriculum preview
export const TESTIMONIALS = [
  {
    name: "Rohit Sharma",
    role: "Full-time Trader, Mumbai",
    quote: "The options module alone changed how I approach expiry days. My win rate jumped from 45% to 68% within 3 months.",
    stars: 5,
  },
  {
    name: "Priya Menon",
    role: "IT Professional, Bengaluru",
    quote: "Live sessions are gold. Getting real-time market context while I sip morning coffee is unbeatable — worth every rupee.",
    stars: 5,
  },
  {
    name: "Amit Verma",
    role: "Small Business Owner, Delhi",
    quote: "I came in a total beginner. By module 12 I was placing my own options trades with proper stop losses. Life changing.",
    stars: 5,
  },
  {
    name: "Sneha Iyer",
    role: "Chartered Accountant, Pune",
    quote: "The risk management module saved my portfolio during last quarter's correction. Every trader needs this course.",
    stars: 5,
  },
  {
    name: "Vikas Patel",
    role: "Engineer, Ahmedabad",
    quote: "Explanations are super clear — no jargon flexing. My wife also started trading after watching the basics module with me.",
    stars: 5,
  },
  {
    name: "Karthik Reddy",
    role: "Swing Trader, Hyderabad",
    quote: "The psychology + journaling section is what separates this course from YouTube fluff. Finally trading with discipline.",
    stars: 4,
  },
];

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

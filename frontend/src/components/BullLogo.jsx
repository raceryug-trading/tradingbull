// Candlestick chart mark for Trading Bulls Academy.
// Alternating emerald (up) + red (down) candles with wicks — reads at every size.
export const BullLogo = ({ className = "", size = 24, glow = true, ...props }) => (
  <span
    className={`relative inline-flex items-center justify-center ${className}`}
    style={{ width: size, height: size }}
    {...props}
  >
    {glow && (
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-emerald-400/25 blur-md -z-10"
      />
    )}
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="block"
      aria-hidden="true"
    >
      {/* Candle 1 — GREEN (up) */}
      <line x1="12" y1="14" x2="12" y2="52" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="7" y="22" width="10" height="22" rx="1.5" fill="#10B981" />

      {/* Candle 2 — RED (down) */}
      <line x1="26" y1="8" x2="26" y2="56" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="21" y="16" width="10" height="30" rx="1.5" fill="#EF4444" />

      {/* Candle 3 — GREEN (up) — tallest, wick top high */}
      <line x1="40" y1="4" x2="40" y2="50" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="35" y="12" width="10" height="30" rx="1.5" fill="#10B981" />

      {/* Candle 4 — RED (down) — small */}
      <line x1="54" y1="18" x2="54" y2="54" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="49" y="26" width="10" height="18" rx="1.5" fill="#EF4444" />
    </svg>
  </span>
);

export default BullLogo;

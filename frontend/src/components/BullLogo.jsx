// Distinctive stylized bull-head mark for Trading Bulls Academy.
// Bold curved horns + minimal head silhouette that reads at any size.
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
      {/* Long curved horns — gold, sweeping outward and up */}
      <path
        d="M22 22
           C 20 18, 14 14, 6 12
           C 10 18, 14 22, 20 26 Z"
        fill="#F59E0B"
      />
      <path
        d="M42 22
           C 44 18, 50 14, 58 12
           C 54 18, 50 22, 44 26 Z"
        fill="#F59E0B"
      />
      {/* Horn tip highlights */}
      <path d="M6 12 L 10 13 L 8 15 Z" fill="#FBBF24" />
      <path d="M58 12 L 54 13 L 56 15 Z" fill="#FBBF24" />

      {/* Bull head — pentagon-ish shape */}
      <path
        d="M32 20
           L 44 22
           L 46 34
           L 38 52
           L 26 52
           L 18 34
           L 20 22 Z"
        fill="#10B981"
      />

      {/* Snout — lighter tone */}
      <path
        d="M26 42
           L 38 42
           L 36 52
           L 28 52 Z"
        fill="#059669"
      />

      {/* Nostrils */}
      <ellipse cx="29" cy="47" rx="1.4" ry="1.8" fill="#0A0D14" />
      <ellipse cx="35" cy="47" rx="1.4" ry="1.8" fill="#0A0D14" />

      {/* Eyes — sharp, angry-bull vibe */}
      <path d="M23 30 L 28 30 L 27 33 L 24 33 Z" fill="#0A0D14" />
      <path d="M41 30 L 36 30 L 37 33 L 40 33 Z" fill="#0A0D14" />

      {/* Center forehead tuft */}
      <path d="M30 22 L 32 18 L 34 22 Z" fill="#065F46" />

      {/* Nose ring — subtle gold */}
      <circle
        cx="32"
        cy="51"
        r="1.8"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="0.9"
      />
    </svg>
  </span>
);

export default BullLogo;

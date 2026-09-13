export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 360"
      role="img"
      aria-label="Illustration of a Dhaka skyline with a medical care badge"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="100%" stopColor="#ecfdf5" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="420" height="360" rx="24" fill="url(#hero-sky)" />

      {/* Skyline silhouette */}
      <g fill="#a7f3d0" opacity="0.9">
        <rect x="20" y="200" width="46" height="130" rx="4" />
        <rect x="76" y="160" width="38" height="170" rx="4" />
        <rect x="124" y="220" width="34" height="110" rx="4" />
        <rect x="320" y="180" width="40" height="150" rx="4" />
        <rect x="366" y="230" width="34" height="100" rx="4" />
      </g>
      <g fill="#6ee7b7" opacity="0.85">
        <rect x="30" y="215" width="10" height="14" rx="2" />
        <rect x="48" y="215" width="10" height="14" rx="2" />
        <rect x="30" y="240" width="10" height="14" rx="2" />
        <rect x="48" y="240" width="10" height="14" rx="2" />
        <rect x="86" y="180" width="9" height="12" rx="2" />
        <rect x="101" y="180" width="9" height="12" rx="2" />
        <rect x="86" y="205" width="9" height="12" rx="2" />
        <rect x="101" y="205" width="9" height="12" rx="2" />
      </g>

      {/* Ground */}
      <rect x="0" y="326" width="420" height="34" fill="#a7f3d0" opacity="0.6" />

      {/* Care badge */}
      <circle cx="210" cy="170" r="96" fill="#ffffff" />
      <circle cx="210" cy="170" r="96" fill="none" stroke="#a7f3d0" strokeWidth="10" />

      {/* Heartbeat line */}
      <path
        d="M130 175h34l14-32 20 56 16-40 10 16h66"
        fill="none"
        stroke="#059669"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Medical cross badge */}
      <g transform="translate(210,110)">
        <circle r="26" fill="#047857" />
        <rect x="-4" y="-15" width="8" height="30" rx="2" fill="#ffffff" />
        <rect x="-15" y="-4" width="30" height="8" rx="2" fill="#ffffff" />
      </g>
    </svg>
  );
}

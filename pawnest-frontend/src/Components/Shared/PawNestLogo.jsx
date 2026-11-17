const PawNestLogo = ({ size = 40, withText = true, className = "", textClassName = "" }) => {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="PawNest logo"
      >
        <defs>
          <linearGradient id="pn-logo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8A6446" />
            <stop offset="1" stopColor="#3E281C" />
          </linearGradient>
          <clipPath id="pn-logo-clip">
            <rect width="64" height="64" rx="18" />
          </clipPath>
        </defs>
        <rect width="64" height="64" rx="18" fill="url(#pn-logo-bg)" />
        <g clipPath="url(#pn-logo-clip)">
          <path
            d="M0 24 C0 8 10 0 24 0 H40 C54 0 64 8 64 24 C46 15 18 15 0 24Z"
            fill="#fff"
            opacity="0.13"
          />
        </g>
        <path
          d="M16 40 C16 30 18 22 20 16 L27 23 C29.5 22.3 34.5 22.3 37 23 L44 16 C46 22 48 30 48 40 C48 47 41 51 32 51 C23 51 16 47 16 40 Z"
          fill="#F5EBDD"
        />
        <ellipse cx="26" cy="37" rx="2" ry="3" fill="#2B1B14" />
        <ellipse cx="38" cy="37" rx="2" ry="3" fill="#2B1B14" />
        <path d="M30 42 h4 l-2 2.6 z" fill="#C8A27A" />
        <path
          d="M13 53 Q32 65 51 53"
          fill="none"
          stroke="#D9A066"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {withText && (
        <span
          className={`font-display text-2xl font-semibold tracking-tight ${textClassName}`}
        >
          PawNest
        </span>
      )}
    </span>
  );
};

export default PawNestLogo;

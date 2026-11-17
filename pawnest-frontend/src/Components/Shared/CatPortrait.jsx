const CatPortrait = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 600 700"
      className={className}
      role="img"
      aria-label="Illustration of a cute cat wearing a caramel collar with a bell"
    >
      <defs>
        <linearGradient id="pn-cat-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0D3AE" />
          <stop offset="1" stopColor="#D2A472" />
        </linearGradient>
        <linearGradient id="pn-cat-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D2A472" />
          <stop offset="1" stopColor="#9C6B45" />
        </linearGradient>
      </defs>

      <path d="M110 700 C120 560 200 505 300 505 C400 505 480 560 490 700 Z" fill="url(#pn-cat-body)" />

      <path d="M128 262 C108 175 122 108 150 96 C176 92 226 128 258 176 Z" fill="url(#pn-cat-fur)" />
      <path d="M472 262 C492 175 478 108 450 96 C424 92 374 128 342 176 Z" fill="url(#pn-cat-fur)" />
      <path d="M150 228 C140 178 148 138 160 128 C182 130 214 156 234 184 Z" fill="#E7A99A" />
      <path d="M450 228 C460 178 452 138 440 128 C418 130 386 156 366 184 Z" fill="#E7A99A" />

      <ellipse cx="300" cy="340" rx="192" ry="160" fill="url(#pn-cat-fur)" />

      <g stroke="#C08A5A" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.7">
        <path d="M300 192 V228" />
        <path d="M270 198 L276 228" />
        <path d="M330 198 L324 228" />
      </g>

      <ellipse cx="228" cy="347" rx="39" ry="47" fill="#6F4E37" />
      <ellipse cx="372" cy="347" rx="39" ry="47" fill="#6F4E37" />
      <ellipse cx="228" cy="347" rx="33" ry="41" fill="#1E130E" />
      <ellipse cx="372" cy="347" rx="33" ry="41" fill="#1E130E" />
      <circle cx="216" cy="331" r="13" fill="#fff" />
      <circle cx="360" cy="331" r="13" fill="#fff" />
      <circle cx="241" cy="364" r="6" fill="#fff" opacity="0.85" />
      <circle cx="385" cy="364" r="6" fill="#fff" opacity="0.85" />

      <ellipse cx="150" cy="405" rx="30" ry="17" fill="#E59A8A" opacity="0.6" />
      <ellipse cx="450" cy="405" rx="30" ry="17" fill="#E59A8A" opacity="0.6" />

      <ellipse cx="300" cy="414" rx="58" ry="40" fill="#FBF6EE" />
      <path d="M287 396 H313 Q313 406 300 414 Q287 406 287 396Z" fill="#D98E7F" />
      <path
        d="M300 414 V424 M300 424 Q287 440 271 428 M300 424 Q313 440 329 428"
        stroke="#7A5240"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <g stroke="#FBF6EE" strokeWidth="3" strokeLinecap="round" opacity="0.75">
        <path d="M200 420 L118 408" />
        <path d="M202 434 L124 442" />
        <path d="M400 420 L482 408" />
        <path d="M398 434 L476 442" />
      </g>

      <path d="M185 490 Q300 548 415 490" stroke="#D9A066" strokeWidth="18" fill="none" strokeLinecap="round" />
      <circle cx="300" cy="540" r="19" fill="#F2C77B" stroke="#C58B3E" strokeWidth="3" />
      <path d="M292 546 H308" stroke="#C58B3E" strokeWidth="3" strokeLinecap="round" />
      <circle cx="293" cy="533" r="5" fill="#fff" opacity="0.6" />

      <ellipse cx="238" cy="672" rx="52" ry="36" fill="#FBF6EE" />
      <ellipse cx="362" cy="672" rx="52" ry="36" fill="#FBF6EE" />
      <g stroke="#D2A472" strokeWidth="3" strokeLinecap="round">
        <path d="M224 660 V678" />
        <path d="M240 656 V678" />
        <path d="M256 660 V678" />
        <path d="M344 660 V678" />
        <path d="M360 656 V678" />
        <path d="M376 660 V678" />
      </g>
    </svg>
  );
};

export default CatPortrait;
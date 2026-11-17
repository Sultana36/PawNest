const GlassFilters = () => {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        {/* Soft liquid refraction used by backdrop glass panels */}
        <filter
          id="pn-water"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.01"
            numOctaves="2"
            seed="9"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>

        {/* Ribbed (fluted) glass: shifts the picture sideways in thin vertical bands */}
        <filter
          id="pn-reeded"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.028 0.0004"
            numOctaves="2"
            seed="4"
            result="ribs"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="ribs"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default GlassFilters;
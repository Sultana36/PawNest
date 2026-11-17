import { useState } from "react";

// Shows a photo from /public/images. If the file is missing, it shows the fallback instead,
// so the page never looks broken while you are still adding photos.
const PhotoFrame = ({ src, alt = "", className = "", fallback = null }) => {
  const [failed, setFailed] = useState(false);

  if (failed) return fallback;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export default PhotoFrame;
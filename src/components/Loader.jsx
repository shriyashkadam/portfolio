import React, { useEffect, useRef, useState } from "react";
import bootVideo from "../assets/images/logoboot.mp4";

// Signals when the intro loader has finished fading out, so the hero copy can
// fade in cleanly afterwards instead of being revealed behind the loader.
export function markLoaderDone() {
  if (window.__loaderDone) return;
  window.__loaderDone = true;
  window.dispatchEvent(new Event("loaderDone"));
}

// Safety fallback: if the video never fires 'ended' (autoplay blocked, decode
// error, etc.), fade out anyway so the site can't get stuck behind the boot
// screen. The boot normally fades when the video finishes playing.
const MAX_BOOT_MS = 9000;

function Loader() {
  const [hiding, setHiding] = useState(false);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setHiding(true); // starts the CSS opacity fade-out
    // Don't rely solely on transitionend firing — signal done shortly after.
    setTimeout(markLoaderDone, 650);
  };

  useEffect(() => {
    const fallback = setTimeout(finish, MAX_BOOT_MS);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <div
      className={`loader${hiding ? " is-done" : ""}`}
      onTransitionEnd={markLoaderDone}
    >
      <video
        className="loader-video"
        src={bootVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
      />
    </div>
  );
}

export default Loader;

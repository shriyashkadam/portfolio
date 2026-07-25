import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A heading whose words rise, unblur and fade in when its section scrolls into
 * view, with a gentle scroll-linked parallax drift while it stays there.
 *
 * Reveal is driven by IntersectionObserver (not GSAP ScrollTrigger) on purpose:
 * scroll-animation.js calls ScrollTrigger.getAll().kill() when the 3D model
 * finishes loading, which would wipe out any ScrollTriggers created here. The
 * IO + a paused GSAP tween survive that, and IO tracks the real viewport that
 * Lenis scrolls, so the reveal stays in sync with the model.
 */
function ScrollRevealText({
  text,
  className = "",
  tag = "h2",
  eyebrow,
  waitForLoader = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const section = el.closest("[class*='-section']");
    if (!section) return;

    const targets = el.querySelectorAll(".srt-inner");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(targets, { clearProps: "all" });
      return;
    }

    gsap.set(targets, { yPercent: 70, opacity: 0, filter: "blur(8px)" });

    const reveal = gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.1,
      ease: "power2.out",
      stagger: 0.07,
      paused: true,
    });

    // The hero is on screen behind the loader from the very first frame; hold
    // its reveal until the loader has faded so it eases in cleanly afterwards
    // rather than being already finished when the loader lifts.
    let firstReveal = true;
    let loaderTimer = null;
    const playReveal = () => {
      const needsWait = waitForLoader && firstReveal && !window.__loaderDone;
      firstReveal = false;
      if (needsWait) {
        const start = () => {
          window.removeEventListener("loaderDone", start);
          clearTimeout(loaderTimer);
          reveal.play();
        };
        window.addEventListener("loaderDone", start);
        loaderTimer = setTimeout(start, 7000); // fallback if the event misfires
      } else {
        reveal.play();
      }
    };

    let shown = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        if (inView && !shown) {
          shown = true;
          playReveal();
        } else if (!inView && shown) {
          shown = false;
          reveal.reverse();
        }
      },
      { threshold: [0, 0.35, 0.6, 1] }
    );
    io.observe(section);

    // Continuous scroll reaction: a small vertical drift, kept tiny so the copy
    // never travels far enough to move onto the model.
    let frame = null;
    const applyParallax = () => {
      frame = null;
      const rect = section.getBoundingClientRect();
      const progress =
        (rect.top + rect.height / 2 - window.innerHeight / 2) /
        window.innerHeight; // ~ -1 (below) .. 0 (centred) .. 1 (above)
      el.style.transform = `translate3d(0, ${(-progress * 26).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(applyParallax);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    applyParallax();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      if (loaderTimer) clearTimeout(loaderTimer);
      reveal.kill();
    };
  }, [text]);

  const words = text.split(" ");
  const Tag = tag;

  return (
    <Tag className={`srt ${className}`} ref={ref} aria-label={text}>
      {eyebrow && (
        <span className="srt-eyebrow" aria-hidden="true">
          <span className="srt-inner">{eyebrow}</span>
        </span>
      )}
      <span className="srt-line" aria-hidden="true">
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <span className="srt-word">
              <span className="srt-inner">{word}</span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  );
}

export default ScrollRevealText;

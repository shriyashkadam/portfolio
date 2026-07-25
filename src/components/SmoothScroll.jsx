import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTION_CLASSES = [
  ".view1-section",
  ".view2-section",
  ".view3-section",
  ".view4-section",
  ".view5-section",
  ".view6-section",
  ".view7-section",
  ".view8-section",
  ".view9-section",
  ".view11-section",
  ".view12-section",
];

// Section index from which the persistent background takes over (view7)
const PERSISTENT_BG_FROM = 6;

const SmoothScroll = () => {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Always start at the top instead of the browser restoring a mid-page offset
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.1,
      // expo-out: fast pickup, long soft landing
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: !reducedMotion,
      smoothTouch: false, // let mobile keep its native momentum scrolling
      touchMultiplier: 1.8,
      mouseMultiplier: 1,
      gestureDirection: "vertical",
    });

    // Exposed so other components can request a smooth scroll (see View7 tiles)
    window.lenis = lenis;
    window.scrollToSection = (target, options) => {
      // On touch devices Lenis hands scrolling back to the browser, and in that
      // state its own scrollTo jumps instantly — use the native one instead.
      if (!lenis.smooth) {
        const el =
          typeof target === "string" ? document.querySelector(target) : target;
        const top =
          typeof target === "number"
            ? target
            : el && el.getBoundingClientRect().top + window.scrollY;
        if (typeof top === "number") {
          window.scrollTo({
            top,
            behavior: reducedMotion ? "auto" : "smooth",
          });
        }
        return;
      }
      lenis.scrollTo(target, { duration: 1.6, ...options });
    };
    // Legacy hook from the old snap-scroller; kept so old callers don't throw
    window.setSmoothScrollSection = () => {};

    // Keep GSAP scroll-driven animations in sync with Lenis' virtual scroll
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Smooth keyboard scrolling (Lenis leaves keys to the browser, which jumps)
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        e.target?.isContentEditable
      ) {
        return;
      }

      const page = window.innerHeight * 0.9;
      let target = null;

      switch (e.key) {
        case "ArrowDown":
          target = lenis.targetScroll + 120;
          break;
        case "ArrowUp":
          target = lenis.targetScroll - 120;
          break;
        case "PageDown":
          target = lenis.targetScroll + page;
          break;
        case "PageUp":
          target = lenis.targetScroll - page;
          break;
        case " ":
          target = lenis.targetScroll + (e.shiftKey ? -page : page);
          break;
        case "Home":
          target = 0;
          break;
        case "End":
          target = lenis.limit;
          break;
        default:
          return;
      }

      e.preventDefault();
      lenis.scrollTo(target, { duration: 0.8 });
    };
    window.addEventListener("keydown", onKeyDown);

    // Layout settles late here (3D canvas, webfonts, images) — re-measure triggers
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const refreshTimer = setTimeout(refresh, 1500);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("load", refresh);
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP's default
      lenis.destroy();
      delete window.lenis;
      delete window.scrollToSection;
      delete window.setSmoothScrollSection;
    };
  }, []);

  // Cross-fade the persistent background once view7 comes into play
  useEffect(() => {
    let frame = null;
    let shown = null;

    const evaluate = () => {
      frame = null;
      let current = 0;
      SECTION_CLASSES.forEach((cls, idx) => {
        const el = document.querySelector(cls);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 2) {
          current = idx;
        }
      });

      const shouldShow = current >= PERSISTENT_BG_FROM;
      if (shouldShow === shown) return; // only fire on an actual change
      shown = shouldShow;
      window.dispatchEvent(
        new Event(shouldShow ? "showPersistentBg" : "hidePersistentBg")
      );
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(evaluate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    evaluate(); // Initial check

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
};

export default SmoothScroll;

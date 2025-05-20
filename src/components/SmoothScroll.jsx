import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

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
  ".view10-section",
  ".view11-section",
];

const SmoothScroll = () => {
  const sectionRefs = useRef([]);
  const currentSection = useRef(0);
  const isAnimating = useRef(false);

  window.setSmoothScrollSection = (sectionSelector) => {
    const idx = SECTION_CLASSES.findIndex((sel) => sel === sectionSelector);
    if (idx !== -1) {
      currentSection.current = idx;
    }
  };

  useEffect(() => {
    sectionRefs.current = SECTION_CLASSES.map((sel) =>
      document.querySelector(sel)
    ).filter(Boolean);

    // Always snap to the current section on load
    window.scrollTo({
      top: sectionRefs.current[0]?.offsetTop || 0,
      behavior: "auto",
    });

    const onWheel = (e) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      let direction = e.deltaY > 0 ? 1 : -1;
      let nextSection = currentSection.current + direction;

      // Prevent scrolling down if already at last section
      if (
        currentSection.current === sectionRefs.current.length - 1 &&
        direction === 1
      ) {
        e.preventDefault();
        return;
      }
      // Prevent scrolling up if already at first section
      if (currentSection.current === 0 && direction === -1) {
        e.preventDefault();
        return;
      }

      // Clamp to valid section range
      nextSection = Math.max(
        0,
        Math.min(sectionRefs.current.length - 1, nextSection)
      );

      if (nextSection === currentSection.current) {
        e.preventDefault();
        return;
      }

      // Snap to the current section before animating to the next
      window.scrollTo({
        top: sectionRefs.current[currentSection.current].offsetTop,
        behavior: "auto",
      });

      isAnimating.current = true;
      document.body.style.overflow = "hidden"; // Prevent native scroll

      // --- FIX: Snap to bottom of section when scrolling up ---
      let scrollTarget;
      if (direction === -1) {
        // Scrolling up: snap to bottom of previous section
        const prevSection = sectionRefs.current[nextSection];
        scrollTarget =
          prevSection.offsetTop + prevSection.offsetHeight - window.innerHeight;
      } else {
        // Scrolling down: snap to top of next section
        scrollTarget = sectionRefs.current[nextSection].offsetTop;
      }

      // Set duration: 1.5 for view 1-7, 1 for view 7-11
      const duration = nextSection < 7 ? 1.5 : 1;

      gsap.to(window, {
        scrollTo: { y: scrollTarget, autoKill: false },
        duration,
        ease: "power1.inOut",
        onUpdate: () => {
          ScrollTrigger.update();
        },
        onComplete: () => {
          isAnimating.current = false;
          currentSection.current = nextSection;
          document.body.style.overflow = "";
          ScrollTrigger.refresh();
        },
      });

      e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    // Prevent keyboard scroll during animation
    const onKeyDown = (e) => {
      if (
        isAnimating.current &&
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "PageDown" ||
          e.key === "PageUp" ||
          e.key === " ")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      // Find the current section index
      let current = 0;
      SECTION_CLASSES.forEach((cls, idx) => {
        const el = document.querySelector(cls);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = idx;
          }
        }
      });

      // Show persistent background for view7-section and below
      if (current >= 6) {
        window.dispatchEvent(new Event("showPersistentBg"));
      } else {
        window.dispatchEvent(new Event("hidePersistentBg"));
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // Initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
};

export default SmoothScroll;

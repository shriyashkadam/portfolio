import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// With free (non-snapping) scrolling the page can rest anywhere, so the
// outgoing copy is faded out before the incoming copy fades in instead of
// cross-fading over the same range — otherwise both read as ghosted overlays.
const FADE_OUT = { start: "top 85%", end: "top 55%" };
const FADE_IN = { start: "top 62%", end: "top 28%" };

export const scrollAnimation = (position, target, isMobile, onUpdate) => {
  // Helper for DRY code
  const pos = (x, y, z) => ({ x, y, z });

  // Clear old triggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // View1 to View2
  gsap.to(position, {
    ...pos(!isMobile ? 7.12 : 11.12, !isMobile ? 0.40 :  0.6, !isMobile ? 0.23 :  0.36),
    scrollTrigger: {
      trigger: ".view2-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
    onUpdate,
  });
  gsap.to(target, {
    ...pos(!isMobile ? 0.00 : 0.00 , !isMobile ? 0.00 : 0.00 , !isMobile ? 0.00 : 0.00 ),
    scrollTrigger: {
      trigger: ".view2-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
  });

  // View2 to View3
  gsap.to(position, {
    ...pos(!isMobile ? 0.22 : 0.48, !isMobile ? 0.05 : 0.11, !isMobile ? -7.13 : -14.98),
    scrollTrigger: {
      trigger: ".view3-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
    onUpdate,
  });
  gsap.to(target, {
    ...pos(!isMobile ? 0.00 : 0.00 , !isMobile ? 0.00 : 0.00 , !isMobile ? 0.00 : 0.00 ),
    scrollTrigger: {
      trigger: ".view3-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
  });

  // View3 to View4
  gsap.to(position, {
    ...pos(!isMobile ? -8.11 : -12.68, !isMobile ? 3.9 : 6.10, !isMobile ? -0.12 : -0.20),
    scrollTrigger: {
      trigger: ".view4-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
    onUpdate,
  });
  gsap.to(target, {
    ...pos(!isMobile ? 0.00 : 0.00, !isMobile ? 0.00 : 0.00, !isMobile ? 0.00 : 0.00),
    scrollTrigger: {
      trigger: ".view4-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
  });

  // View4 to View5
  gsap.to(position, {
    ...pos(!isMobile ? -2.70 : -4.24, !isMobile ? 8.58 : 13.42, !isMobile ? 0.00 : 0.00),
    scrollTrigger: {
      trigger: ".view5-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
    onUpdate,
  });
  gsap.to(target, {
    ...pos(!isMobile ? 0.00 : 0.00, !isMobile ? 0.00 : 0.00, !isMobile ? 0.00 : 0.00),
    scrollTrigger: {
      trigger: ".view5-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
  });

  // View5 to View6
  gsap.to(position, {
    ...pos(!isMobile ? -2.11 : -1.61, !isMobile ? 1.52 : 0.06, !isMobile ? 0.53 : 0.52),
    scrollTrigger: {
      trigger: ".view6-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
    onUpdate,
  });
  gsap.to(target, {
    ...pos(!isMobile ? 0.00 : 1.23, !isMobile ? 0.00 : -0.10, !isMobile ? 0.00 : -0.4),
    scrollTrigger: {
      trigger: ".view6-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
  });

  // View6 to View7
  gsap.to(position, {
    ...pos(!isMobile ? 0.90 : 0.90, !isMobile ? -0.08 : -0.08, !isMobile ? -0.29 : -0.29),
    scrollTrigger: {
      trigger: ".view7-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
    onUpdate,
  });
  gsap.to(target, {
    ...pos(!isMobile ? 1.23 : 1.23 , !isMobile ? -0.10 : 0.10 , !isMobile ? -0.4 : -0.4),
    scrollTrigger: {
      trigger: ".view7-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      immediateRender: false,
      invalidateOnRefresh: true,
    },
  });

  // Opacity transitions (optional, but keep them separate for smoothness)
  [
    { section: ".view1-section", trigger: ".view2-section" },
    { section: ".view2-section", trigger: ".view3-section" },
    { section: ".view3-section", trigger: ".view4-section" },
    { section: ".view4-section", trigger: ".view5-section" },
    { section: ".view5-section", trigger: ".view6-section" },
    { section: ".view6-section", trigger: ".view7-section" },
  ].forEach(({ section, trigger }) => {
    gsap.to(section, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: FADE_OUT.start,
        end: FADE_OUT.end,
        scrub: true,
        immediateRender: false,
        invalidateOnRefresh: true,
      },
    });
  });

  [
    { section: ".view2-section", trigger: ".view2-section" },
    { section: ".view3-section", trigger: ".view3-section" },
    { section: ".view4-section", trigger: ".view4-section" },
    { section: ".view5-section", trigger: ".view5-section" },
    { section: ".view6-section", trigger: ".view6-section" },
    { section: ".view7-section", trigger: ".view7-section" },
  ].forEach(({ section, trigger }) => {
    gsap.to(section, {
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: FADE_IN.start,
        end: FADE_IN.end,
        scrub: true,
        immediateRender: false,
        invalidateOnRefresh: true,
      },
    });
  });
};
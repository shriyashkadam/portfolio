import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export const scrollAnimation = (position, target, isMobile, onUpdate) => {
  // Helper for DRY code
  const pos = (x, y, z) => ({ x, y, z });

  // Clear old triggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // View1 to View2
  gsap.to(position, {
    ...pos(!isMobile ? 7.12 : -7.0, !isMobile ? 0.40 : -12.2, !isMobile ? 0.23 : -6.0),
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
    ...pos(!isMobile ? 0.00 : 0.7, !isMobile ? 0.00 : 1.9, !isMobile ? 0.00 : 0.7),
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
    ...pos(!isMobile ? 0.22 : -9, !isMobile ? 0.05 : -14, !isMobile ? -7.13 : -8),
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
    ...pos(!isMobile ? 0.00 : 1, !isMobile ? 0.00 : 2, !isMobile ? 0.00 : 1),
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
    ...pos(!isMobile ? -8.11 : -11, !isMobile ? 3.9 : -16, !isMobile ? -0.12 : -10),
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
    ...pos(!isMobile ? 0.00 : 1.5, !isMobile ? 0.00 : 2.2, !isMobile ? 0.00 : 2),
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
    ...pos(!isMobile ? -2.70 : -13, !isMobile ? 8.58 : -18, !isMobile ? 0.00 : -12),
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
    ...pos(!isMobile ? 0.00 : 2, !isMobile ? 0.00 : 2.5, !isMobile ? 0.00 : 3),
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
    ...pos(!isMobile ? -2.11 : -15, !isMobile ? 1.52 : -20, !isMobile ? 0.53 : -14),
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
    ...pos(!isMobile ? 0.00 : 2.5, !isMobile ? 0.00 : 2.7, !isMobile ? 0.00 : 4),
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
    ...pos(!isMobile ? 0.90 : -17, !isMobile ? -0.08 : -22, !isMobile ? -0.29 : -16),
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
    ...pos(!isMobile ? 1.23 : 3, !isMobile ? -0.10 : 3, !isMobile ? -0.4 : 5),
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
      scrollTrigger: {
        trigger,
        start: "top 80%",
        end: "top 20%",
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
      scrollTrigger: {
        trigger,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
        immediateRender: false,
        invalidateOnRefresh: true,
      },
    });
  });
};
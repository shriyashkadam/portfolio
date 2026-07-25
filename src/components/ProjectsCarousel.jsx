import React, { useCallback, useEffect, useRef, useState } from "react";

// Cover Flow tuning.
//
// Note: the cards overlap through layout (a negative margin in the CSS), not
// through translateX. CSS scroll snapping measures the *transformed* border
// box, so shifting cards sideways here would move the snap points underneath
// the browser and it would settle between projects. Rotation, scale and depth
// all keep a card centred on its own layout position, so they are safe — and
// perspective on the receding cards produces the inward bunching for free.
const MAX_TILT = 52; // deg the side cards turn toward the centre
const DEPTH_STEP = 220; // px pushed back per card away from the centre
const MAX_DEPTH = 3; // cards beyond this are fully stacked/faded

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function ProjectsCarousel({ projects }) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const frame = useRef(null);
  const activeRef = useRef(0);
  const drag = useRef(null);
  const reduced = useRef(false);
  const idleTimer = useRef(null);
  const programmatic = useRef(false); // suppresses idle-snap during our own scrollTo
  const [active, setActive] = useState(0);

  // Re-project every card from its distance to the centre of the viewport
  const layout = useCallback(() => {
    frame.current = null;
    const track = trackRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!track || !cards.length) return;

    const centre = track.scrollLeft + track.clientWidth / 2;
    const spacing =
      cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : cards[0].offsetWidth;
    if (!spacing) return;

    let nearest = 0;
    let nearestDistance = Infinity;

    cards.forEach((card, i) => {
      const cardCentre = card.offsetLeft + card.offsetWidth / 2;
      const d = (cardCentre - centre) / spacing; // distance in "cards"
      const a = Math.abs(d);

      if (a < nearestDistance) {
        nearestDistance = a;
        nearest = i;
      }

      const depth = -clamp(a, 0, MAX_DEPTH) * DEPTH_STEP;
      const tilt = -clamp(d, -1, 1) * MAX_TILT;
      const scale = 1 - clamp(a, 0, MAX_DEPTH) * 0.08;
      const opacity =
        a <= 1 ? 1 - a * 0.4 : Math.max(0.08, 0.6 - (a - 1) * 0.25);
      const blur = a < 0.4 ? 0 : Math.min((a - 0.4) * 3, 3);

      card.style.transform = reduced.current
        ? `scale(${scale})`
        : `translateZ(${depth}px) rotateY(${tilt}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = blur ? `blur(${blur}px)` : "";
      card.style.zIndex = String(100 - Math.round(a * 10));
      card.classList.toggle("is-active", a < 0.5);
    });

    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActive(nearest);
    }
  }, []);

  const schedule = useCallback(() => {
    if (frame.current === null) frame.current = requestAnimationFrame(layout);
  }, [layout]);

  const scrollToIndex = useCallback((index, behavior = "smooth") => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    programmatic.current = true;
    track.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
      behavior: reduced.current ? "auto" : behavior,
    });
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const track = trackRef.current;
    if (!track) return;

    // After scrolling stops, settle on the nearest card. This is the only
    // snap mechanism (CSS mandatory snap is off) so it covers wheel, trackpad
    // and touch momentum alike; our own scrollTo sets `programmatic` so it is
    // left to land exactly on target.
    const onScroll = () => {
      schedule();
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        idleTimer.current = null;
        if (programmatic.current) {
          programmatic.current = false;
          return;
        }
        if (drag.current) return;
        const card = cardRefs.current[activeRef.current];
        if (!card) return;
        const target =
          card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
        if (Math.abs(track.scrollLeft - target) > 1) scrollToIndex(activeRef.current);
      }, 120);
    };
    track.addEventListener("scroll", onScroll, { passive: true });

    // Trackpad: a sideways gesture drives the carousel, a vertical one is left
    // alone so the page keeps its own smooth scrolling.
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      e.stopPropagation(); // keep it away from the page-level smooth scroller
      track.scrollLeft += e.deltaX;
    };
    track.addEventListener("wheel", onWheel, { passive: false });

    // Mouse drag to scrub. Touch is left to the browser's native scrolling.
    const onPointerDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag.current = {
        id: e.pointerId,
        startX: e.clientX,
        startLeft: track.scrollLeft,
        moved: 0,
      };
      track.classList.add("is-dragging");
    };

    const onPointerMove = (e) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.startX;
      d.moved = Math.max(d.moved, Math.abs(dx));
      if (d.moved > 4 && !d.capturing) {
        d.capturing = true;
        track.setPointerCapture(e.pointerId);
      }
      track.scrollLeft = d.startLeft - dx;
    };

    const endDrag = () => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      track.classList.remove("is-dragging");
      // Settle on whichever card ended up nearest the centre
      scrollToIndex(activeRef.current);
      if (d.moved > 4) {
        // Swallow the click that follows a drag
        const swallow = (ev) => ev.stopPropagation();
        track.addEventListener("click", swallow, { capture: true, once: true });
        setTimeout(() => {
          track.removeEventListener("click", swallow, { capture: true });
        }, 0);
      }
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(Math.min(activeRef.current + 1, projects.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(Math.max(activeRef.current - 1, 0));
      }
    };
    track.addEventListener("keydown", onKeyDown);

    // Card widths are viewport-relative, so re-project whenever they change
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    cardRefs.current.filter(Boolean).forEach((c) => observer.observe(c));

    schedule();
    const settle = setTimeout(schedule, 300); // once images/fonts have landed

    return () => {
      clearTimeout(settle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      observer.disconnect();
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("keydown", onKeyDown);
    };
  }, [schedule, scrollToIndex, projects.length]);

  const go = (delta) =>
    scrollToIndex(clamp(activeRef.current + delta, 0, projects.length - 1));

  return (
    <div className="coverflow">
      <button
        type="button"
        className="coverflow-arrow coverflow-arrow-prev"
        onClick={() => go(-1)}
        disabled={active === 0}
        aria-label="Previous project"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <div
        className="coverflow-track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
      >
        {projects.map((project, i) => (
          <article
            className="coverflow-card"
            key={project.title}
            ref={(el) => (cardRefs.current[i] = el)}
            onClick={() => i !== active && scrollToIndex(i)}
            aria-label={`${project.title}, project ${i + 1} of ${projects.length}`}
          >
            <div className="coverflow-img">
              <img src={project.image} alt={project.alt} draggable="false" />
            </div>
            <div className="coverflow-body">
              <h2>{project.title}</h2>
              {project.desc && <p>{project.desc}</p>}
              <ul>
                {project.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="coverflow-arrow coverflow-arrow-next"
        onClick={() => go(1)}
        disabled={active === projects.length - 1}
        aria-label="Next project"
      >
        <span aria-hidden="true">›</span>
      </button>

      <div className="coverflow-dots">
        {projects.map((project, i) => (
          <button
            type="button"
            key={project.title}
            className={`coverflow-dot${i === active ? " is-active" : ""}`}
            onClick={() => scrollToIndex(i)}
            aria-label={`Show ${project.title}`}
            aria-current={i === active}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectsCarousel;

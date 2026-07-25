import React, { useEffect, useState, useRef } from "react";

const tileContent = [
  {
    title: "Work Experience",
    desc: "See my professional journey and roles I've held.",
    target: ".view8-section",
  },
  {
    title: "Projects",
    desc: "Explore some of the projects I have built.",
    target: ".view9-section",
  },
  { title: "Skills", desc: "Discover my skillset.", target: ".view11-section" },
  {
    title: "Contact Me",
    desc: "Let's connect! Reach out for collaboration or questions.",
    target: ".view12-section",
  },
];

function View7() {
  const [showTiles, setShowTiles] = useState(false);
  const tileRefs = useRef([]);

  useEffect(() => {
    const show = () => setShowTiles(true);
    const hide = () => setShowTiles(false);
    window.addEventListener("showView7Tiles", show);
    window.addEventListener("hideView7Tiles", hide);
    return () => {
      window.removeEventListener("showView7Tiles", show);
      window.removeEventListener("hideView7Tiles", hide);
    };
  }, []);

  // 3D tilt effect handlers
  useEffect(() => {
    tileRefs.current.forEach((tile) => {
      if (!tile) return;
      const handleMouseMove = (e) => {
        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        // Sensitive effect: max 10deg tilt
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * -10;
        tile.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      };
      const handleMouseLeave = () => {
        tile.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg)";
      };
      tile.addEventListener("mousemove", handleMouseMove);
      tile.addEventListener("mouseleave", handleMouseLeave);
      tile.addEventListener("blur", handleMouseLeave);
    });
    // Cleanup
    return () => {
      tileRefs.current.forEach((tile) => {
        if (!tile) return;
        tile.removeEventListener("mousemove", () => {});
        tile.removeEventListener("mouseleave", () => {});
        tile.removeEventListener("blur", () => {});
      });
    };
  }, [showTiles]);

  // Scroll to section on tile click
  const handleTileClick = (targetSelector) => {
    const section = document.querySelector(targetSelector);
    if (!section) return;
    // Route through the smooth scroller so it doesn't fight the native one
    if (window.scrollToSection) {
      window.scrollToSection(section);
    } else {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="view7-section"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        className="view7-tiles"
        style={{
          opacity: showTiles ? 1 : 0,
          pointerEvents: showTiles ? "auto" : "none",
          transition: "opacity 0.8s cubic-bezier(.4,0,.2,1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {tileContent.map((tile, i) => (
          <div
            className="view7-tile"
            key={i}
            tabIndex={0}
            ref={(el) => (tileRefs.current[i] = el)}
            onClick={() => handleTileClick(tile.target)}
            style={{ cursor: "pointer" }}
          >
            <h3>{tile.title}</h3>
            <p>{tile.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default View7;

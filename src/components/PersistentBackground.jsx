import React, { useEffect, useState } from "react";

function PersistentBackground() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showBg = () => setShow(true);
    const hideBg = () => setShow(false);

    window.addEventListener("showPersistentBg", showBg);
    window.addEventListener("hidePersistentBg", hideBg);

    return () => {
      window.removeEventListener("showPersistentBg", showBg);
      window.removeEventListener("hidePersistentBg", hideBg);
    };
  }, []);

  return (
    <div
      className="persistent-bg"
      style={{
        opacity: show ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.8s cubic-bezier(.4,0,.2,1)",
        position: "fixed",
        inset: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh"
      }}
    />
  );
}

export default PersistentBackground;
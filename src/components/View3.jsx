// import React from 'react';

// function View3() {
//   return (
//     <div className="view3-section">
//       <div className="view1-main-text vibrant-heading">
//         Full Stack Developer &lt;/&gt; Computer Engineer
//       </div>
//     </div>
//   );
// }

// export default View3;

import React, { useEffect, useState, useRef } from "react";

function View3() {
  const [animate, setAnimate] = useState(false);
  const delayTimeout = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const section = document.querySelector(".view3-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (
          rect.top < window.innerHeight * 0.7 &&
          rect.bottom > window.innerHeight * 0.3
        ) {
          setAnimate(false); // Reset first to restart animation
          if (delayTimeout.current) clearTimeout(delayTimeout.current);
          delayTimeout.current = setTimeout(() => setAnimate(true), 50); // 200ms delay
        } else {
          setAnimate(false);
          if (delayTimeout.current) clearTimeout(delayTimeout.current);
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll(); // Initial check
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (delayTimeout.current) clearTimeout(delayTimeout.current);
    };
  }, []);

  return (
    <div className="view3-section">
      <div
        className={`view1-main-text${
          animate ? " fadein-text" : ""
        } vibrant-heading`}
      >
        {animate ? "Full Stack Developer </&> Computer Engineer" : ""}
      </div>
    </div>
  );
}

export default View3;

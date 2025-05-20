import React from 'react';

function ScrollDown({ text = "Scroll to explore" }) {
  return (
    <div className="scroll-down">
      <div className="arrow" />
      <span>{text}</span>
    </div>
  );
}

export default ScrollDown;
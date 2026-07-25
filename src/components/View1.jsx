import React from "react";
import ScrollRevealText from "./ScrollRevealText";

function View1() {
  return (
    <div className="view1-section">
      <ScrollRevealText
        className="view-heading"
        tag="h1"
        eyebrow="Welcome to my portfolio"
        text="Hi there!"
        waitForLoader
      />
    </div>
  );
}

export default View1;

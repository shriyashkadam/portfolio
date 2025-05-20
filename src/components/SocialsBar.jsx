import React from "react";

export default function SocialsBar() {
  return (
    <div className="socials-bar">
      <a
        href="/resume.pdf" // Update this path to your actual resume file
        className="socials-icon"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Resume"
        title="Resume"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/file-text.svg"
          alt="Resume"
        />
      </a>
    </div>
  );
}

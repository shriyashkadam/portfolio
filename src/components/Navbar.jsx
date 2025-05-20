import React from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

function Navbar() {
  return (
    <div className="navbar">
      {/* Socials buttons with custom colors */}
      <div className="nav-group">
        <a
          href="https://github.com/shriyashkadam"
          className="nav-btn nav-github"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <img
            className="nav-icon"
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg"
            alt="GitHub"
          />
        </a>
        <a
          href="https://www.linkedin.com/in/shriyash-kadam/"
          className="nav-btn nav-linkedin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <img
            className="nav-icon"
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg"
            alt="LinkedIn"
          />
        </a>
        <a
          href="mailto:shriyashkadam6@gmail.com"
          className="nav-btn nav-email"
          aria-label="Email"
          title="Send Email"
        >
          <img
            className="nav-icon"
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maildotru.svg"
            alt="Email"
          />
        </a>
      </div>
      <div className="nav-divider" />
      <button className="nav-btn spotify-btn">
        <img
          className="nav-icon"
          src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg"
          alt="Spotify"
          title="I just like how it looks"
        />
      </button>
    </div>
  );
}

export default Navbar;

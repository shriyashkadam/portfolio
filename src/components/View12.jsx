import React from "react";
import { FaLinkedin, FaGithub, FaRegEnvelope } from "react-icons/fa";
import portraitImg from "../assets/images/portrait.jpg"; // Replace with your actual image path

const workoutSplit = [
  "Day 1: Upper Body (Chest, Shoulders, Back, Forearms)",
  "Day 2: Lower Body (Quads, Calves, Core)",
  "Day 3: Upper Body (Chest, Shoulders, Back, Forearms)",
  "Day 4: Lower Body (Glutes, Hamstrings, Calves, Core)",
  "Day 5: Arms (Biceps, Triceps, Core)",
  "Day 6: Rest or Active Recovery",
  "Day 7: Rest or Active Recovery",
];

const linkedinUrl = "https://www.linkedin.com/in/shriyash-kadam/";
const githubUrl = "https://github.com/shriyashkadam";
const email = "shriyashkadam6@gmail.com";

function View12() {
  return (
    <div className="view12-section">
      <div className="view12-section-content">
        <div className="view12-top">
          <h1 className="view12-heading">More About Me</h1>
          <div className="view12-about-row">
            <div className="view12-portrait-tile">
              <img src={portraitImg} alt="Portrait" />
            </div>
            <div className="view12-about-tile">
              <div className="view12-about-title">About Me</div>
              <div className="view12-about-desc">
                I am a passionate fitness and tech enthusiast who thrives on
                exploring new technologies and pushing my physical limits.
                Whether it's coding, lifting weights, or learning something new,
                I enjoy the process of growth and self-improvement. Outside of
                work and the gym, I love swimming, playing basketball, and
                experimenting with new recipes in the kitchen. My curiosity and
                drive help me balance a healthy, active lifestyle with a deep
                commitment to personal and professional development.
              </div>
            </div>
            <div className="view12-workout-tile">
              <div className="view12-workout-title">Current Workout Split</div>
              <ul className="view12-workout-list">
                {workoutSplit.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="view12-bottom">
          <h2 className="view12-contact-heading">Contact Me</h2>
          <div className="view12-contact-tiles">
            <a
              className="view12-contact-tile"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <FaGithub className="view12-contact-icon" />
              <span>GitHub</span>
            </a>
            <a
              className="view12-contact-tile"
              href={`mailto:${email}`}
              title="Email"
            >
              <FaRegEnvelope className="view12-contact-icon" />
              <span className="email-label">
                <span className="email-desktop">{email}</span>
                <span className="email-mobile">Email</span>
              </span>
            </a>
            <a
              className="view12-contact-tile"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin className="view12-contact-icon" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
      <div className="view12-footer">
        <span>shriyashkadam 2000-25 &reg;</span>
      </div>
    </div>
  );
}

export default View12;

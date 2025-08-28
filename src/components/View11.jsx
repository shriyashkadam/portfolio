import React from "react";
import {
  FaBootstrap,
  FaAngular,
  FaPython,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaDatabase,
  FaGitAlt,
  FaDocker,
} from "react-icons/fa";
import {
  SiDotnet,
  SiApachekafka,
  SiCplusplus,
  SiTypescript,
  SiJavascript,
  SiMongodb,
} from "react-icons/si";
import { LuUnplug } from "react-icons/lu"; // For WebSockets

const skills = [
  { icon: <FaBootstrap />, label: "Bootstrap" },
  { icon: <FaAngular />, label: "Angular" },
  { icon: <FaAngular />, label: "AngularJS" },
  { icon: <SiDotnet />, label: ".NET Core" },
  { icon: <SiApachekafka />, label: "Kafka" },
  { icon: <FaDocker />, label: "Docker" },
  { icon: <LuUnplug />, label: "WebSockets" }, // Updated icon
  { icon: <SiCplusplus />, label: "C++" },
  { icon: <FaPython />, label: "Python" },
  { icon: <FaHtml5 />, label: "HTML" },
  { icon: <FaJs />, label: "JavaScript" },
  { icon: <SiTypescript />, label: "TypeScript" },
  { icon: <FaCss3Alt />, label: "CSS" },
  { icon: <FaDatabase />, label: "SQL" },
  { icon: <SiMongodb />, label: "MongoDB" },
];

function View11() {
  return (
    <div className="view11-section">
      <div className="view11-section-content">
        <h1 className="view11-heading">Skills</h1>
        <div className="skills-grid">
          {skills.map((skill, idx) => (
            <div className="skill-tile" key={idx}>
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-label">{skill.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default View11;

import React from "react";
import projectImg1 from "../assets/images/project3.png";
import projectImg2 from "../assets/images/project4.png";

function View9() {
  return (
    <div className="view9-section">
      <div className="view9-section-content">
        <h1 className="view9-heading">Projects</h1>
        <div
          className="view9-tiles"
          style={{
            overflowX: "auto",
            display: "flex",
            flexDirection: "row",
            gap: "2.5rem",
            width: "90vw",
            maxWidth: "1500px",
            justifyContent: "center",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="view9-tile">
            <div className="view9-img-wrapper">
              <img src={projectImg1} alt="LapMaker: AI Driver Coach" />
            </div>
            <div className="view9-tile-content">
              <h2>LapMaker</h2>
              <ul>
                <li>
                  Cross-platform desktop app for racing simulator telemetry and
                  AI-powered coaching.
                </li>
                <li>
                  Real-time telemetry analysis, optimal lap extraction, and
                  feedback using local LLMs with RAG.
                </li>
                <li>
                  Contextual advice and session history with semantic memory and
                  interactive UI.
                </li>
                <li>
                  Delivers personalized, actionable feedback to help drivers
                  improve performance over time.
                </li>
              </ul>
            </div>
          </div>
          <div className="view9-tile">
            <div className="view9-img-wrapper">
              <img src={projectImg2} alt="NLQ: Natural Language Querying" />
            </div>
            <div className="view9-tile-content">
              <h2>Natural Language Querying</h2>
              <ul>
                <li>
                  Full-stack app for querying SQL databases using natural
                  language.
                </li>
                <li>
                  Backend introspects schema and uses Ollama for secure,
                  accurate SQL generation.
                </li>
                <li>
                  Prompt engineering and context logic ensure accurate, secure
                  queries.
                </li>
                <li>
                  Dynamic schema extraction and secure execution with
                  SQLAlchemy.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default View9;

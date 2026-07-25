import React from "react";
import ProjectsCarousel from "./ProjectsCarousel";
import projectImg1 from "../assets/images/project3.png";
import projectImg2 from "../assets/images/project4.png";
import projectImg3 from "../assets/images/project1.jpg";
import projectImg4 from "../assets/images/project2.jpeg";

const projects = [
  {
    title: "LapMaker",
    image: projectImg1,
    alt: "LapMaker: AI Driver Coach",
    points: [
      "Cross-platform desktop app for racing simulator telemetry and AI-powered coaching.",
      "Real-time telemetry analysis, optimal lap extraction, and feedback using local LLMs with RAG.",
      "Contextual advice and session history with semantic memory and interactive UI.",
      "Delivers personalized, actionable feedback to help drivers improve performance over time.",
    ],
  },
  {
    title: "Natural Language Querying",
    image: projectImg2,
    alt: "NLQ: Natural Language Querying",
    points: [
      "Full-stack app for querying SQL databases using natural language.",
      "Backend introspects schema and uses Ollama for secure, accurate SQL generation.",
      "Prompt engineering and context logic ensure accurate, secure queries.",
      "Dynamic schema extraction and secure execution with SQLAlchemy.",
    ],
  },
  {
    title: "RealityScope: AR for Education",
    image: projectImg3,
    alt: "RealityScope: AR for Education",
    desc: "An Android app that brings textbooks to life by displaying 3D models in AR, making complex engineering concepts easier to understand.",
    points: [
      "Developed using Unity3D as the main platform.",
      "3D models created in Blender.",
      "AR features integrated with Vuforia in Unity3D.",
      "Model attributes and functions specified using C#.",
    ],
  },
  {
    title: "BookMyGround",
    image: projectImg4,
    alt: "BookMyGround",
    desc: "A dynamic web application for booking and managing payments for turfs and courts in specific time slots, with a responsive UI for all devices.",
    points: [
      "Backend built with Django and PostgreSQL database.",
      "RESTful APIs for client-server data transfer.",
      "Tested using Selenium and deployed on Microsoft Azure.",
    ],
  },
];

function View9() {
  return (
    <div className="view9-section">
      <div className="view9-section-content">
        <h1 className="view9-heading">Projects</h1>
        <ProjectsCarousel projects={projects} />
      </div>
    </div>
  );
}

export default View9;

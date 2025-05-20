import React from 'react'
import projectImg1 from '../assets/images/project1.jpg'
import projectImg2 from '../assets/images/project2.jpeg'

function View9() {
  return (
    <div className="view9-section">
      <div className="view9-section-content">
        <h1 className="view9-heading">Projects</h1>
        <div className="view9-tiles">
          <div className="view9-tile">
            <div className="view9-img-wrapper">
              <img src={projectImg1} alt="RealityScope: AR for Education" />
            </div>
            <div className="view9-tile-content">
              <h2>RealityScope: AR for Education</h2>
              <p>
                An Android app that brings textbooks to life by displaying 3D models in AR, making complex engineering concepts easier to understand.
              </p>
              <ul>
                <li>Developed using Unity3D as the main platform.</li>
                <li>3D models created in Blender.</li>
                <li>AR features integrated with Vuforia in Unity3D.</li>
                <li>Model attributes and functions specified using C#.</li>
              </ul>
            </div>
          </div>
          <div className="view9-tile">
            <div className="view9-img-wrapper">
              <img src={projectImg2} alt="BookMyGround" />
            </div>
            <div className="view9-tile-content">
              <h2>BookMyGround</h2>
              <p>
                A dynamic web application for booking and managing payments for turfs and courts in specific time slots, with a responsive UI for all devices.
              </p>
              <ul>
                <li>Backend built with Django and PostgreSQL database.</li>
                <li>RESTful APIs for client-server data transfer.</li>
                <li>Tested using Selenium and deployed on Microsoft Azure.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default View9

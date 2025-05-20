import React from 'react'
import companyLogo1 from '../assets/images/company1logo.webp'
import companyLogo2 from '../assets/images/company2logo.jpeg'


function View8() {
  return (
    <div className='view8-section'>
      <div className="view8-section-content">
        <h1 className="view8-heading">Work Experience</h1>
        <div className="view8-tiles">
          <div className="view8-tile">
            <div className="view8-logo-placeholder">
              <img src={companyLogo1} alt="" />
            </div>
            <div className="view8-tile-content">
              <h2>Full Stack Developer</h2>
              <p>Yardi</p>
              <p>Aug 2023 - Present</p>
              <ul>
                <li>
                  Core developer for the Framework Team, contributing to a platform used by 70+ products.
                </li>
                <li>
                  Built scalable features including an Inter-Application Notification system (SignalR, Kafka, Docker).
                </li>
                <li>
                  Worked across Angular, AngularJS, .NET, JavaScript, TypeScript, MySQL, RESTful APIs, and Bootstrap.
                </li>
              </ul>
            </div>
          </div>
          <div className="view8-tile">
            <div className="view8-logo-placeholder">
              <img src={companyLogo2} alt="" />
            </div>
            <div className="view8-tile-content">
              <h2>Data Analytics Intern</h2>
              <p>Fyra Insights</p>
              <p>Mar 2021 - Jun 2021</p>
              <ul>
                <li>
                  Conducted exploratory data analysis on restaurant footfall patterns and identified key features using Python and NLP techniques.
                </li>
                <li>
                  Developed a decision tree regression model achieving a 93% R² score for predicting restaurant success and user ratings.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default View8

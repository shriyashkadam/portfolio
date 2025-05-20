import React from "react";
import AnimatedLogo from "../assets/images/logo-animated5.gif";

function Loader() {
  return (
    <div className="loader">
      <img src={AnimatedLogo} alt="Loading..." />
    </div>
  );
}

export default Loader;

import View1 from "./components/View1.jsx";
import View2 from "./components/View2.jsx";
import View3 from "./components/View3.jsx";
import View4 from "./components/View4.jsx";
import View5 from "./components/View5.jsx";
import View6 from "./components/View6.jsx";
import View7 from "./components/View7.jsx";
import View8 from "./components/View8.jsx";
import View9 from "./components/View9.jsx";
import View10 from "./components/View10.jsx";
import View11 from "./components/View11.jsx";
import View12 from "./components/View12.jsx";
import Navbar from "./components/Navbar.jsx";
import ScrollDown from "./components/ScrollDown.jsx";
import WebgiViewer from "./components/WebgiViewer";
import Loader from "./components/Loader";
import SmoothScroll from "./components/SmoothScroll";
import PersistentBackground from "./components/PersistentBackground";
import SocialsBar from "./components/SocialsBar.jsx";
import { useRef, useEffect, useState } from "react";

function App() {
  const webgiViewerRef = useRef();
  const contentRef = useRef();
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const view6 = document.querySelector(".view6-section");
      if (view6) {
        const rect = view6.getBoundingClientRect();
        setShowNav(rect.top > 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="App">
      <PersistentBackground />
      <SmoothScroll />
      <Loader />
      <div className={`persistent-bg-main`} />
      <div className={`persistent-glow-bg`} />
      {showNav && <Navbar />}
      {showNav && <SocialsBar />}
      {showNav && <ScrollDown text="Scroll to explore" />}
      <div id="content" ref={contentRef}>
        <View1 />
        <View2 />
        <View3 />
        <View4 />
        <View5 />
        <View6 />
        <View7 />
        <View8 />
        <View9 />
        <View10 />
        <View11 />
        <View12 />
      </div>
      <WebgiViewer ref={webgiViewerRef} contentRef={contentRef} />
    </div>
  );
}

export default App;

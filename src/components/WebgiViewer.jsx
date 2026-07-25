import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
} from "react";
import {
  ViewerApp,
  AssetManagerPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  GammaCorrectionPlugin,
  mobileAndTabletCheck,
  InteractionPromptPlugin,
  EXRLoadPlugin, // Use EXRLoadPlugin for .exr support
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimation } from "../lib/scroll-animation";

gsap.registerPlugin(ScrollTrigger);

const SECTION_CLASSES = [
  ".view1-section",
  ".view2-section",
  ".view3-section",
  ".view4-section",
  ".view5-section",
  ".view6-section",
  ".view7-section",
  ".view8-section",
  ".view9-section",
  ".view11-section",
  ".view12-section",
  // Add more if you have more views
];

const WebgiViewer = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const [viewerRef, setViewerRef] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [positionRef, setPositionRef] = useState(null);
  const [targetRef, setTargetRef] = useState(null);
  const canvasContainerRef = useRef(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isMobile, setIsMobile] = useState(null);

  const memoizedScrollAnimation = useCallback(
    (position, target, isMobile, onUpdate) => {
      if (position && target && onUpdate) {
        scrollAnimation(position, target, isMobile, onUpdate);
      }
    },
    []
  );

  const setupViewer = useCallback(async () => {
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
      uiOptions: {
        displayControlsIndicators: false,
      },
    });
    setViewerRef(viewer);
    const isMobileOrTablet = mobileAndTabletCheck();
    setIsMobile(isMobileOrTablet);

    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;

    setCameraRef(camera);
    setPositionRef(position);
    setTargetRef(target);

    viewer.renderer.renderScale = Math.min(window.devicePixelRatio, 2);

    // Add the EXRLoadPlugin so .exr files can be loaded
    await viewer.addPlugin(EXRLoadPlugin);

    // Load only the plugins you need
    await viewer.getOrAddPlugin(AssetManagerPlugin);
    await viewer.getOrAddPlugin(ProgressivePlugin);
    await viewer.getOrAddPlugin(TonemapPlugin);
    await viewer.getOrAddPlugin(GammaCorrectionPlugin);

    viewer.renderer.refreshPipeline();

    await viewer.load("./avpmodel2.glb");
    const tonemap = viewer.getPlugin(TonemapPlugin);
    if (tonemap) tonemap.config.clipBackground = true;
    await viewer.setEnvironmentMap(
      "https://dist.pixotronics.com/webgi/assets/hdr/gem_2.hdr"
    );

    viewer.scene.activeCamera.setCameraOptions({
      controlsEnabled: false,
    });

    if (isMobileOrTablet) {
      position.set(11.12, 0.63, 0.36);
      target.set(0, 0, 0);
      props.contentRef.current.className = "mobile-or-tablet";
    }

    window.scrollTo(0, 0);

    let needsUpdate = true;

    const onUpdate = () => {
      needsUpdate = true;
      viewer.setDirty();
    };

    viewer.addEventListener("preFrame", () => {
      if (needsUpdate) {
        camera.positionTargetUpdated(true);
        needsUpdate = false;
      }
    });

    memoizedScrollAnimation(position, target, isMobileOrTablet, onUpdate);
  }, []);

  useEffect(() => {
    setupViewer();

    const canvasContainer = canvasContainerRef.current;
    if (!canvasContainer) return;

    canvasContainer.style.transition = "opacity 0.8s cubic-bezier(.4,0,.2,1)";

    let hideTimeout = null;
    let fadeTimeout = null;
    let frame = null;
    let hidden = null; // last applied canvas state, so we only react to changes
    let tilesVisible = null;

    const setTiles = (visible) => {
      if (visible === tilesVisible) return;
      tilesVisible = visible;
      window.dispatchEvent(
        new Event(visible ? "showView7Tiles" : "hideView7Tiles")
      );
    };

    const currentSectionIndex = () => {
      const middle = window.innerHeight / 2;
      for (let i = 0; i < SECTION_CLASSES.length; i++) {
        const el = document.querySelector(SECTION_CLASSES[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= middle && rect.bottom > middle) return i;
        }
      }
      return 0;
    };

    function checkSection() {
      frame = null;
      const currentSection = currentSectionIndex();
      const shouldHide = currentSection >= 6;

      if (shouldHide) {
        if (hidden !== true) {
          hidden = true;
          // Let the model linger for a beat before dissolving out
          hideTimeout = setTimeout(() => {
            hideTimeout = null;
            canvasContainer.style.opacity = "0";
            fadeTimeout = setTimeout(() => {
              fadeTimeout = null;
              canvasContainer.style.pointerEvents = "none";
              setTiles(currentSectionIndex() === 6);
            }, 800);
          }, 1000);
        } else if (!hideTimeout && !fadeTimeout) {
          // Canvas already faded — tiles just follow the current section
          setTiles(currentSection === 6);
        }
      } else if (hidden !== false) {
        hidden = false;
        if (hideTimeout) clearTimeout(hideTimeout);
        if (fadeTimeout) clearTimeout(fadeTimeout);
        hideTimeout = fadeTimeout = null;
        canvasContainer.style.opacity = "1";
        canvasContainer.style.pointerEvents = previewMode ? "all" : "none";
        setTiles(false);
      }
    }

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(checkSection);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    checkSection();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      if (hideTimeout) clearTimeout(hideTimeout);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, [setupViewer, previewMode]);

  const handleExit = useCallback(() => {
    canvasContainerRef.current.style.pointerEvents = "none";
    props.contentRef.current.style.opacity = "1";
    setPreviewMode(false);
    viewerRef.scene.activeCamera.setCameraOptions({
      controlsEnabled: false,
      showCameraControls: false,
      controlsIndicator: false,
    });
    gsap.to(positionRef, {
      x: !isMobile ? 1.56 : 9.36,
      y: !isMobile ? 5.0 : 10.95,
      z: !isMobile ? 0.01 : 0.09,
      scrollTrigger: {
        trigger: ".display-section",
        start: "top bottom",
        end: "top top",
        scrub: 2,
        immediateRender: false,
      },
      onUpdate: () => {
        viewerRef.setDirty();
        cameraRef.positionTargetUpdated(true);
      },
    });
    gsap.to(targetRef, {
      x: !isMobile ? -0.55 : -1.62,
      y: !isMobile ? 0.32 : 0.02,
      z: !isMobile ? 0.0 : -0.06,
      scrollTrigger: {
        trigger: ".display-section",
        start: "top bottom",
        end: "top top",
        scrub: 2,
        immediateRender: false,
      },
    });
  }, [canvasContainerRef, viewerRef, cameraRef, positionRef, targetRef]);

  return (
    <div id="webgi-canvas-container" ref={canvasContainerRef}>
      <canvas id="webgi-canvas" ref={canvasRef} />
      {previewMode && (
        <div className="button" onClick={handleExit}>
          Exit
        </div>
      )}
    </div>
  );
});

export default WebgiViewer;

import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
    ViewerApp,
    AssetManagerPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    mobileAndTabletCheck,
    GammaCorrectionPlugin,
    addBasePlugins,
    CanvasSnipperPlugin,
    TweakpaneUiPlugin,
    InteractionPromptPlugin
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollAnimation } from '../lib/scroll-animation';

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
  ".view10-section",
  ".view11-section",


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

  // useImperativeHandle(ref, () => ({
  //   triggerpreview() {
  //     setPreviewMode(true);
  //     canvasContainerRef.current.style.pointerEvents = "all";
  //     props.contentRef.current.style.opacity = "0";
  //     gsap.to(positionRef, {
  //       x: 13.04,
  //       y: -2.01,
  //       z: 2.29,
  //       duration: 2,
  //       onUpdate: () => {
  //         viewerRef.setDirty();
  //         cameraRef.positionTargetUpdated(true);
  //       }
  //     });
  //     gsap.to(targetRef, {
  //       x: 0.11,
  //       y: 0.0,
  //       z: 0.0,
  //       duration: 2,
  //     });
  //     viewerRef.scene.activeCamera.setCameraOptions({
  //       controlsEnabled: true,
  //       showCameraControls: false,
  //       controlsIndicator: false
  //     });
  //   },
  // }));

  const memoizedScrollAnimation = useCallback(
    (position, target, isMobile, onUpdate) => {
      if (position && target && onUpdate) {
        scrollAnimation(position, target, isMobile, onUpdate);
      }
    }, []
  );

  const setupViewer = useCallback(async () => {
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
      uiOptions: {
        displayControlsIndicators: false
      }
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

    await addBasePlugins(viewer);
    viewer.getPlugin(InteractionPromptPlugin).disable();
    await viewer.load('./avpmodel2.glb');
    viewer.getPlugin(TonemapPlugin).config.clipBackground = true

    viewer.scene.activeCamera.setCameraOptions({
      controlsEnabled: false
    });

    if (isMobileOrTablet) {
      position.set(-16.7, 1.17, 11.7);
      target.set(0, 1.37, 0);
      props.contentRef.current.className = "mobile-or-tablet";
    }

    window.scrollTo(0, 0);

    let needsUpdate = true;

    const onUpdate = () => {
      needsUpdate = true;
      viewer.setDirty();
    }

    viewer.addEventListener('preFrame', () => {
      if (needsUpdate) {
        camera.positionTargetUpdated(true)
        needsUpdate = false;
      }
    })

    memoizedScrollAnimation(position, target, isMobileOrTablet, onUpdate);
  }, []);

  useEffect(() => {
    setupViewer();

    const canvasContainer = canvasContainerRef.current;
    if (!canvasContainer) return;

    canvasContainer.style.transition = "opacity 0.8s cubic-bezier(.4,0,.2,1)";

    let hideTimeout = null;

    function checkSection() {
      let currentSection = 0;
      for (let i = 0; i < SECTION_CLASSES.length; i++) {
        const el = document.querySelector(SECTION_CLASSES[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            currentSection = i;
            break;
          }
        }
      }

      // Always clear any pending hide timeout before setting a new one
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }

      if (currentSection >= 6) { // 6 = View7, 7 = View8, etc.
        if (canvasContainer.style.opacity !== "0") {
          hideTimeout = setTimeout(() => {
            canvasContainer.style.opacity = "0";
            setTimeout(() => {
              canvasContainer.style.pointerEvents = "none";
              // Only show tiles in View7, not in View8 or below
              if (currentSection === 6) {
                window.dispatchEvent(new Event("showView7Tiles"));
              } else {
                window.dispatchEvent(new Event("hideView7Tiles"));
              }
            }, 800); // match fade duration
          }, 1000);
        } else {
          // If already hidden, still ensure correct tile event
          if (currentSection === 6) {
            window.dispatchEvent(new Event("showView7Tiles"));
          } else {
            window.dispatchEvent(new Event("hideView7Tiles"));
          }
        }
      } else {
        if (canvasContainer.style.opacity !== "1") {
          canvasContainer.style.opacity = "1";
          canvasContainer.style.pointerEvents = previewMode ? "all" : "none";
          window.dispatchEvent(new Event("hideView7Tiles"));
        }
      }
    }

    window.addEventListener('scroll', checkSection);
    checkSection();

    return () => {
      window.removeEventListener('scroll', checkSection);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [setupViewer, previewMode]);

  const handleExit = useCallback(() => {
    canvasContainerRef.current.style.pointerEvents = "none";
    props.contentRef.current.style.opacity = "1";
    setPreviewMode(false);
    viewerRef.scene.activeCamera.setCameraOptions({
      controlsEnabled: false,
      showCameraControls: false,
      controlsIndicator: false
    });
    gsap.to(positionRef, {
      x: !isMobile ? 1.56 : 9.36,
      y: !isMobile ? 5.0 : 10.95,
      z: !isMobile ? 0.01 : 0.09,
      scrollTrigger: {
        trigger: '.display-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 2,
        immediateRender: false
      },
      onUpdate: () => {
        viewerRef.setDirty();
        cameraRef.positionTargetUpdated(true);
      }
    });
    gsap.to(targetRef, {
      x: !isMobile ? -0.55 : -1.62,
      y: !isMobile ? 0.32 : 0.02,
      z: !isMobile ? 0.0 : -0.06,
      scrollTrigger: {
        trigger: '.display-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 2,
        immediateRender: false
      },
    });
  }, [canvasContainerRef, viewerRef, cameraRef, positionRef, targetRef]);

  return (
    <div id='webgi-canvas-container' ref={canvasContainerRef} >
      <canvas id='webgi-canvas' ref={canvasRef} />
      {
        previewMode && (
          <div className="button" onClick={handleExit}>Exit</div>
        )
      }
    </div>
  )
});

export default WebgiViewer;

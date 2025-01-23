/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import NotCompatible from "./NotCompatible";
import { useDispatch, useSelector } from "react-redux";
import { changeProctoringStatus } from "@/redux/slices/assessment/thunk";
import { clearAssessmentTestReportProctorState } from "@/redux/slices/assessment";

const ProctoringLayout = () => {
  const dispatch = useDispatch();

  const {
    assessmentTestData: {
      report: {
        proctor: { fullScreenExited, isSuccess, isError },
      },
    },
  } = useSelector((state) => state.assessment);

  const containerRef = useRef(null);
  const [isCompatible, setIsCompatible] = useState(true);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  // Check compatibility for mobile & desktop browser. Test is only accessible in chrome browser.
  const checkCompatibility = async () => {
    let isChromeBrowser = false;
    let isMobileDevice = false;
    if (navigator.userAgentData) {
      const uaData = navigator.userAgentData;
      isChromeBrowser = uaData.brands.some(
        (brand) => brand.brand === "Google Chrome"
      );
      isMobileDevice = uaData.mobile;
    } else {
      const userAgent = navigator.userAgent.toLowerCase();
      isChromeBrowser =
        userAgent.includes("chrome") && !userAgent.includes("edg");
      isMobileDevice =
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
          userAgent
        );
    }
    setIsCompatible(isChromeBrowser && !isMobileDevice);
  };

  // Fullscreen mode
  const handleFullScreenChange = () => {
    if (!document.fullscreenElement) {
      setIsFullScreenMode(false);
      if (!fullScreenExited) {
        dispatch(changeProctoringStatus({ fullScreenExited: true }));
      }
    } else {
      setIsFullScreenMode(true);
    }
  };

  const enterFullScreen = () => {
    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
    } else if (containerRef.current.mozRequestFullScreen) {
      containerRef.current.mozRequestFullScreen();
    } else if (containerRef.current.webkitRequestFullscreen) {
      containerRef.current.webkitRequestFullscreen();
    } else if (containerRef.current.msRequestFullscreen) {
      containerRef.current.msRequestFullscreen();
    }
  };

  useEffect(() => {
    checkCompatibility();
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      dispatch(clearAssessmentTestReportProctorState());
    }
  }, [isSuccess, isError]);

  if (!isCompatible) {
    return <NotCompatible />;
  }

  return (
    <section className="w-screen h-screen">
      <Outlet context={{ isFullScreenMode, enterFullScreen }} />
    </section>
  );
};

export default ProctoringLayout;

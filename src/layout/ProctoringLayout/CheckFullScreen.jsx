/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/lib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/lib/ui/dialog";
import { clearAssessmentTestReportProctorState } from "@/redux/slices/assessment";
import { changeProctoringStatus } from "@/redux/slices/assessment/thunk";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const CheckFullScreen = () => {
  const dispatch = useDispatch();
  const {
    assessmentTestData: {
      report: {
        proctor: { fullScreenExited, isSuccess, isError },
      },
    },
  } = useSelector((state) => state.assessment);

  const containerRef = useRef(null);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

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

  return (
    <section ref={containerRef} className="w-screen h-screen">
      {isFullScreenMode ? (
        <Outlet />
      ) : (
        <Dialog open={!isFullScreenMode}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Full-Screen Mode Required</DialogTitle>
              <DialogDescription>
                Please accept the permission to enter full-screen mode to
                continue with the test.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={enterFullScreen}>Accept permission</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default CheckFullScreen;

import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

const CheckCameraPermission = () => {
  const { isFullScreenMode, enterFullScreen, exitFullScreen } =
    useOutletContext();

  const [cameraPermission, setCameraPermission] = useState(null);
  /* const [cameraStream, setCameraStream] = useState(null); */

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
    } catch (error) {
      setCameraPermission(false);
    }
  };

  const removeCameraPermission = () => {
    setCameraPermission(false);
  };

  /* const removeCameraPermission = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCameraPermission(false);
      alert("Camera access has been canceled.");
    }
  };*/

  /*
  useEffect(() => {
    // Cleanup function to stop the camera stream if necessary
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);
  */

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <Outlet
      context={{
        isFullScreenMode,
        enterFullScreen,
        exitFullScreen,
        cameraPermission,
        requestCameraPermission,
        removeCameraPermission,
      }}
    />
  );
};

export default CheckCameraPermission;

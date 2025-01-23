import React, { useState, useRef, useEffect } from "react";
import { axiosServerInstance } from "@/utils/api/instances";
import { serverRoutes } from "@/utils/api/routes";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/lib/ui/use-toast";
import LoadingSpinner from "@/components/shared/LoaderSpinner";
import { Button } from "@/lib/ui/button";

const ProctoringDetails = ({
  handleStartTest,
  candidatePhotoUrl,
  setCandidatePhotoUrl,
  isLoading,
}) => {
  const [imageTaken, setImageTaken] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const dispatch = useDispatch();

  const [uploadProgress, setUploadProgress] = useState(0);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }
  };

  useEffect(() => {
    // Access the user's webcam
    startVideo();
  }, []);

  const handleTakeSnapshot = () => {
    // Draw the current video frame to the canvas
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const dataUrl = canvasRef.current.toDataURL("image/png");
      setSnapshot(dataUrl);
      setImageTaken(true);
      videoRef.current.pause(); // Pause the video feed

      // Convert the data URL to a File object
      const file = dataURLtoFile(dataUrl, "candidate_photo.png");
      handleUploadCandidatePhoto(file);
    }
  };

  const handleRetakeSnapshot = () => {
    setImageTaken(false);
    setSnapshot(null);
    if (videoRef.current) {
      videoRef.current.play(); // Resume the video feed
    } else {
      startVideo();
    }
  };

  const handleUploadCandidatePhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosServerInstance.post(
        serverRoutes.uploadCandidatePhoto,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      const url = response.data.url;
      setCandidatePhotoUrl(url);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      toast({
        title: "Upload Photo",
        variant: "destructive",
        description: message,
      });
    }
  };

  // Helper function to convert data URL to a File object
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="flex flex-col mt-20 p-6 bg-gray-50">
      <h1 className="flex flex-col items-center text-2xl font-semibold text-teal-600 mb-4">
        Proctoring Details
      </h1>
      <p className="mb-6 font-roboto font-medium text-xl leading-[28.13px] text-[rgba(59,59,59,1)]">
        You’re about to start the assessment after this step
      </p>

      <div className="flex flex-row gap-10 ">
        <div className="flex flex-row bg-white shadow-md rounded-lg w-3/4">
          {/* Instructions Section */}
          <div className="w-full">
            <div className="h-[60px] flex flex-col justify-center rounded-t-lg border bg-[#E7EBEF] border-t-[#C5C5C5] ">
              <h2 className="text-md my-auto font-medium text-left ml-5">
                Image Details
              </h2>
            </div>
            <div className="flex flex-row">
              <img
                alt="Logo"
                src="/Exclamation.svg"
                className="w-[24px] h-[24px] mr-3 ml-3 my-auto"
              />
              <p className="text-[#3B3B3B] mt-3">
                This assessment requires you to take an image of yourself to be
                used for proctoring purposes. Please ensure to follow the
                instructions below:
              </p>
            </div>

            <div className="ml-12 mt-3 text-gray-700">
              <p className="flex items-center text-base">
                <span className="text-primary text-4xl mr-3">&#8226;</span>
                Look straight into the camera
              </p>
              <p className="flex items-center text-base">
                <span className="text-primary text-4xl mr-3">&#8226;</span>
                Your face is not covered
              </p>
              <p className="flex items-center text-base">
                <span className="text-primary text-4xl mr-3">&#8226;</span>
                Room is properly lit up
              </p>
              <p className="flex items-center text-base">
                <span className="text-primary text-4xl mr-3">&#8226;</span>
                There should not be any other person or picture of a person in
                the frame
              </p>
            </div>

            <div className="h-[60px] w-[95%] mt-16 mb-5 flex justify-center mx-auto rounded-lg border bg-[#E7EBEF] border-t-[#C5C5C5] ">
              <img
                alt="Logo"
                src="/Warning.svg"
                className="w-[24px] h-[24px] mr-3 ml-3 my-auto"
              />

              <p className="mt-4 text-xs text-[#808080]">
                <strong>
                  Violation of any of the above rules during the course of the
                  assessment will be captured and shared with the assessment
                  admin and can affect your candidature.
                </strong>
              </p>
            </div>
          </div>
        </div>
        {/* Snapshot Section */}
        <div className="w-1/2 flex flex-col items-center">
          <div className="mb-4 w-full h-2/3 mr-10 bg-gray-200 rounded-md flex items-center justify-center">
            {imageTaken ? (
              <img
                src={snapshot}
                alt="Captured Snapshot"
                className="rounded-md w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                className="rounded-md w-full h-full object-cover"
              ></video>
            )}
          </div>
          <button
            onClick={imageTaken ? handleRetakeSnapshot : handleTakeSnapshot}
            className="bg-primary text-white py-2 px-4 rounded-md focus:outline-none"
          >
            <div className="flex justify-center">
              <img
                alt="Logo"
                src="/Camera.svg"
                className="w-[24px] h-[24px] mr-3 ml-3 my-auto"
              />
              <p>{imageTaken ? "Retake Snapshot" : "Take Snapshot"}</p>
            </div>
          </button>
        </div>
      </div>
      <Button
        disabled={isLoading}
        onClick={handleStartTest} // Call the prop function
        className="mt-6 w-[200px] mx-auto flex justify-center items-center bg-primary text-white py-2 px-6 rounded-md focus:outline-none"
      >
        {isLoading ? <LoadingSpinner /> : "Start Test"}
      </Button>
      {/* Hidden Canvas for Capturing Snapshot */}
      <canvas ref={canvasRef} width="640" height="480" className="hidden" />
    </div>
  );
};

export default ProctoringDetails;

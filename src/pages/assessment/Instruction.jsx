/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/lib/ui/button";
import { toast } from "@/lib/ui/use-toast";
import { generateAssessment } from "@/redux/slices/assessment/thunk";
import { testInstructions } from "@/utils/constants/instructions";
import { formatTime } from "@/utils/methods";
import OutlinedBadge from "@/components/shared/OutlinedBadge";
import { Checkbox } from "@/lib/ui/checkbox";
import Title from "@/components/shared/Title";
import LoadingSpinner from "@/components/shared/LoaderSpinner";
import { clearAssessmentTestReportState } from "@/redux/slices/assessment";
import ProctoringDetails from "./ProctoringDetails"; // Import your ProctoringDetails component
import { changeProctoringStatus } from "@/redux/slices/assessment/thunk";

const Instruction = () => {
  const { id } = useParams();
  const { state } = useLocation();

  const dispatch = useDispatch();
  const { assessmentDetails, assessmentTestData } = useSelector(
    (state) => state.assessment
  );

  const { designation, duration } = assessmentDetails;
  const { report } = assessmentTestData;
  const { isLoading, isSuccess, isError, message } = report;

  const [isChecked, setIsChecked] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [showProctoringDetails, setShowProctoringDetails] = useState(false); // State to control component rendering
  const [candidatePhotoUrl, setCandidatePhotoUrl] = useState("");

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setPermissionGranted(true);
        setCameraStream(stream);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setPermissionGranted(false);
      }
    };

    requestCameraPermission();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const handleNextClick = () => {
    if (!permissionGranted) {
      alert("Camera permission is required to proceed.");
      return;
    }
    setShowProctoringDetails(true); // Show the ProctoringDetails component
  };

  const handleStartTest = async () => {
    if (!permissionGranted) {
      alert("Camera permission is required to proceed.");
      return;
    }

    if (candidatePhotoUrl) {
      dispatch(generateAssessment({ id, values: state }));

      // Set a timeout to dispatch the action after 10 seconds
      const timeoutId = setTimeout(() => {
        dispatch(
          changeProctoringStatus({ candidatePicture: candidatePhotoUrl })
        );
      }, 5000);

      // Clear the timeout when the component unmounts
      useEffect(() => {
        return () => clearTimeout(timeoutId);
      }, []);
    } else {
      toast({
        title: "🚀 Missing Candidate Photo",
        description: "Please take the snapshot before starting the test!!",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "🚀 Test Started",
        description: "Best of luck!!",
      });
      dispatch(clearAssessmentTestReportState());
    }
    if (isError) {
      toast({
        title: "Failed to start test",
        description: message,
        variant: "destructive",
      });
      dispatch(clearAssessmentTestReportState());
    }
  }, [isError, message]);

  if (!state?.name || !state?.email || !state?.linkedin || !state?.resume) {
    return <Navigate to={`/assessment/login/${id}`} />;
  }

  // TEST DURATION
  const testDuration = formatTime(duration);
  // HEADER DATA
  const header = [
    { title: "Job Role", description: designation },
    { title: "Number of Questions", description: "10" },
    { title: "Test Duration", description: testDuration },
  ];

  // Conditionally render either the instruction page or the proctoring details
  if (showProctoringDetails) {
    return (
      <ProctoringDetails
        handleStartTest={handleStartTest}
        candidatePhotoUrl={candidatePhotoUrl}
        setCandidatePhotoUrl={setCandidatePhotoUrl}
        isLoading={isLoading}
      />
    ); // Pass the function as a prop
  }

  return (
    <div className="bg-gray-100 p-28 flex flex-col gap-10 w-full h-full overflow-y-auto">
      <Title
        title="Test Instructions"
        className="text-4xl font-bold text-primary text-center"
      />
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          {header.map(({ title, description }) => {
            return (
              <OutlinedBadge
                key={title}
                title={title}
                description={description}
                mainClassName="border border-gray-300 !bg-gray-200"
                titleClassName="text-gray-700 !font-medium"
                className="bg-gray-300"
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-5">
          <Title
            title="Please read the below test instructions very carefully before
            proceeding for the Test."
            className="font-medium text-gray-700"
          />
          <ul className="flex flex-col gap-2 text-gray-700">
            {testInstructions.map(({ instruction, id, title }) => (
              <li key={id}>
                <b>
                  {id}. {title}:{" "}
                </b>
                {instruction}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={isChecked}
            onCheckedChange={setIsChecked}
          />
          <label htmlFor="terms" className="">
            I have read and I agree to the{" "}
            <a href="#" className="text-primary">
              terms and conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary">
              privacy policy
            </a>
          </label>
        </div>
      </div>
      <span className="flex justify-center ">
        <Button
          disabled={isLoading || !isChecked}
          onClick={handleNextClick} // Update to call handleNextClick instead of handleStartTest
          className="w-[330px]"
        >
          {isLoading ? <LoadingSpinner /> : "Next"}
        </Button>
      </span>
    </div>
  );
};

export default Instruction;

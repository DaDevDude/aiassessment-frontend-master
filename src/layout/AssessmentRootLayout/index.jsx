/* eslint-disable react-hooks/exhaustive-deps */
import LoadingSpinner from "@/components/shared/LoaderSpinner";
import { toast } from "@/lib/ui/use-toast";
import {
  clearAssessmentDetailsState,
  clearAssessmentTestDataState,
} from "@/redux/slices/assessment";
import {
  getAssessmentDetails,
  getAssessmentReportByCookie,
} from "@/redux/slices/assessment/thunk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const AssessmentRootLayout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { assessmentDetails, assessmentTestData } = useSelector(
    (state) => state.assessment
  );

  const { isLoading, isError, isSuccess, message } = assessmentDetails;
  const {
    isLoading: isTestLoading,
    isError: isTestError,
    isSuccess: isTestSuccess,
  } = assessmentTestData;

  useEffect(() => {
    dispatch(getAssessmentDetails({ id }));
  }, [id]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearAssessmentDetailsState());
    }
    if (isError) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      dispatch(clearAssessmentDetailsState());
      navigate("/not-found");
    }
  }, [isSuccess, isError, message]);

  useEffect(() => {
    dispatch(getAssessmentReportByCookie());
  }, []);

  useEffect(() => {
    if (isTestError || isTestSuccess) {
      dispatch(clearAssessmentTestDataState());
    }
  }, [isTestError, isTestSuccess]);

  if (isLoading || isTestLoading) {
    return (
      <main className="w-screen h-screen flex justify-center items-center">
        <LoadingSpinner />
      </main>
    );
  }

  return <Outlet />;
};

export default AssessmentRootLayout;

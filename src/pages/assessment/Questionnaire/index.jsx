/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import QuestionAnswerCard from "./QuestionAnswerCard";
import { submitAssessment } from "@/redux/slices/assessment/thunk";
import { useEffect } from "react";
import {
  clearAssessmentState,
  clearAssessmentTestReportState,
} from "@/redux/slices/assessment";
import { toast } from "@/lib/ui/use-toast";

const AssessmentQuestionnaire = () => {
  const dispatch = useDispatch();

  const {
    isLoading,
    isSuccess,
    isError,
    message,
    assessmentTestData,
    assessmentDetails,
  } = useSelector((state) => state.assessment);

  const { duration } = assessmentDetails;
  const { report } = assessmentTestData;
  const {
    createdAt: testStartedAt,
    isLoading: isReportLoading,
    isSuccess: isReportSuccess,
    isError: isReportError,
    message: isReportMessage,
  } = report;

  const handleSubmit = () => {
    dispatch(submitAssessment());
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Test submitted successfully",
      });
      dispatch(clearAssessmentState());
    }
    if (isError) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      dispatch(clearAssessmentState());
    }
  }, [isSuccess, isError, message]);

  useEffect(() => {
    if (isReportSuccess) {
      dispatch(clearAssessmentTestReportState());
    }
    if (isReportError) {
      toast({
        title: "Error",
        description: isReportMessage,
      });
      dispatch(clearAssessmentTestReportState());
    }
  }, [isReportError, isReportSuccess]);

  return (
    <div className="w-screen h-screen">
      <Header
        testStartedAt={testStartedAt}
        duration={duration}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isReportLoading={isReportLoading}
      />
      <QuestionAnswerCard
        isLoading={isLoading}
        isReportLoading={isReportLoading}
        report={report}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AssessmentQuestionnaire;

/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "@/lib/ui/use-toast";
import { clearAssessmentTestReportProctorState } from "@/redux/slices/assessment";
import { changeProctoringStatus } from "@/redux/slices/assessment/thunk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const CheckForTabChange = () => {
  const dispatch = useDispatch();

  const {
    assessmentTestData: {
      report: {
        proctor: { tabSwitched, isSuccess, isError },
      },
    },
  } = useSelector((state) => state.assessment);

  const handleTabSwitch = () => {
    const count = tabSwitched + 1;
    dispatch(changeProctoringStatus({ tabSwitched: count }));
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      toast({
        title: "Tab switch detected",
        description: "Please do not switch tabs",
        variant: "destructive",
        duration: 4000,
      });
      handleTabSwitch();
    }
  };

  useEffect(() => {
    if (isSuccess || isError) {
      dispatch(clearAssessmentTestReportProctorState());
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabSwitched]);

  return <Outlet />;
};

export default CheckForTabChange;

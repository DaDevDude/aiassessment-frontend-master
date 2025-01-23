import { useSelector } from "react-redux";
import { Navigate, Outlet, useParams } from "react-router-dom";

const AssessmentMainLayout = () => {
  const { id } = useParams();

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const {
    assessmentTestData: { report },
  } = useSelector((state) => state.assessment);

  if (!report?.status) {
    return <Navigate to={`/assessment/login/${id}`} replace />;
  }

  if (report.status === "completed") {
    exitFullScreen();
    return <Navigate to={`/completed`} replace />;
  }

  if (report.status !== "inprogress") {
    return <Navigate to={`/not-found`} replace />;
  }

  return <Outlet />;
};

export default AssessmentMainLayout;

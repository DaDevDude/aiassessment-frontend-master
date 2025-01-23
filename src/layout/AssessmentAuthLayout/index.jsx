import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AssessmentAuthLayout = () => {
  const { report } = useSelector(
    (state) => state.assessment.assessmentTestData
  );

  if (report.status == "inprogress") {
    const id = report.assessmentId;
    return <Navigate to={`/assessment/${id}`} replace />;
  }

  if (report.status == "completed") {
    return <Navigate to={`/completed`} replace />;
  }

  return (
    <section className="w-screen h-screen">
      <Navbar />
      <div className="w-full h-full">
        <Outlet />
      </div>
    </section>
  );
};

export default AssessmentAuthLayout;

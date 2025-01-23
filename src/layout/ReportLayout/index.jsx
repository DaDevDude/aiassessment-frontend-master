import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import NavBar from "../DashboardLayout/Navbar";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "@/components/shared/LoaderSpinner";
import { clearreportDataDetailsState, getReport } from "@/redux/slices/reports";

const ReportLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const {  isLoading } = useSelector((state) => state.reports.reportDataDetails);
  const reportDetails = location.state.reportDetails;
  useEffect(() => {
    dispatch(getReport({
      candiateId: reportDetails.candidate.id,
      reportId: reportDetails.id,
    }));
}, []);

    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }

    if (isLoading) {
      return (
        <LoadingSpinner />
      );
    }

  
    return <main className="bg-slate-50">
    <NavBar />
    <div className="flex">
      <section className="w-full min-h-screen pt-28 p-2">
        <Outlet />
      </section>
    </div>
  </main>
};
export default ReportLayout;

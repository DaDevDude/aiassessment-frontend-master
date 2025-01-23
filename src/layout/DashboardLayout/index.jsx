import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import SideBar from "./SideBar";
import { getAssessments } from "@/redux/slices/manageAssessment";
import LoadingSpinner from "@/components/shared/LoaderSpinner";

const DashboardLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { assessmentDetails } =
    useSelector((state) => state.assessment);

  React.useEffect(() => {
      dispatch(getAssessments({
        currentPage: assessmentDetails.currentPage,
        itemsPerPage: assessmentDetails.itemsPerPage,
        sortConfig: assessmentDetails.sortConfig,
        selectedOption: assessmentDetails.selectedOption,
        finalSearchString: assessmentDetails.finalSearchString
      }));
  }, [dispatch, assessmentDetails]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (assessmentDetails.isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <main className="bg-slate-50 w-screen h-screen">
      <NavBar />
      <div className="flex">
        <SideBar />
        <section className="w-full min-h-screen pt-24 p-4">
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default DashboardLayout;

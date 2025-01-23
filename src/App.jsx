// SHADCN UI
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ReduxProvider } from "./providers/redux";
import ToastProvider from "./providers/toast";
// LAYOUTS
import RootLayout from "./layout/RootLayout";
import AuthLayout from "./layout/AuthLayout";
import DashboardLayout from "./layout/DashboardLayout";
import AssessmentRootLayout from "./layout/AssessmentRootLayout";
import AssessmentAuthLayout from "./layout/AssessmentAuthLayout";
import AssessmentMainLayout from "./layout/AssessmentMainLayout";
// COMPONENTS
import Login from "./pages/auth/LoginForm";
import Register from "./pages/auth/RegisterForm";
import Dashboard from "./pages/dashboard/Dashboard";
import CreateAssessment from "./pages/dashboard/CreateAssessment";
import ManageAssessment from "./pages/dashboard/ManageAssessment";
import UserManagement from "./pages/dashboard/UserManagement";
import Settings from "./pages/dashboard/Settings";
import AssessmentLogin from "./pages/assessment/AssessmentLogin";
import AssessmentInstruction from "./pages/assessment/Instruction";
import UploadResume from "./pages/assessment/UploadResume";
import Questionnaire from "./pages/assessment/Questionnaire";
import NotFound from "./pages/NotFound";
import Completed from "./pages/Completed";
import AssessmentDetails from "./pages/dashboard/AssessmentDetails";
import ReportLayout from "./layout/ReportLayout";
import CandidateTestReport from "./pages/report/CandidateTestReport";
import CheckFullScreen from "./layout/ProctoringLayout/CheckFullScreen";
import CheckForTabChange from "./layout/ProctoringLayout/CheckForTabChange";
import CheckBrowserCompatibility from "./layout/ProctoringLayout/CheckBrowserCompatibility";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        {/* ADMIN AUTH ROUTES */}
        <Route path="auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        {/* ADMIN DASHBOARD ROUTES */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-assessment" element={<CreateAssessment />} />
          <Route path="manage-assessment" element={<ManageAssessment />} />
          <Route path="assessment-details" element={<AssessmentDetails />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      {/* REPORT ROUTES */}
      <Route path="report" element={<ReportLayout />}>
        <Route path=":candidateId" element={<CandidateTestReport />} />
      </Route>
      {/* ASSESSMENT ROUTES */}
      <Route element={<CheckBrowserCompatibility />}>
        <Route path="assessment" element={<AssessmentRootLayout />}>
          <Route element={<AssessmentAuthLayout />}>
            <Route path="login/:id" element={<AssessmentLogin />} />
            <Route path="upload/resume/:id" element={<UploadResume />} />
            <Route path="instruction/:id" element={<AssessmentInstruction />} />
          </Route>
          <Route element={<AssessmentMainLayout />}>
            <Route element={<CheckForTabChange />}>
              <Route element={<CheckFullScreen />}>
                <Route path=":id" element={<Questionnaire />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="completed" element={<Completed />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const App = () => {
  return (
    <ReduxProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ReduxProvider>
  );
};

export default App;

/*
<Route element={<CheckBrowser />}>
        <Route element={<CheckFullScreen />}>
          <Route element={<CheckCameraPermission />}>
            <Route element={<CheckMultipleMonitors />}>
              <Route element={<CheckForTabChange />}>
              {children}
              </Route>
            </Route>
          </Route>
        </Route>
</Route>
*/

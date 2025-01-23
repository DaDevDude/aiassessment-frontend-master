import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <main className="w-screen h-screen bg-slate-50 flex justify-center items-center">
      <Outlet />
    </main>
  );
};

export default AuthLayout;

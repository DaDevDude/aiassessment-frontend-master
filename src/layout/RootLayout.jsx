import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProfile } from "@/redux/slices/auth/thunk";
import LoadingSpinner from "@/components/shared/LoaderSpinner";

const RootLayout = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const getSelfProfile = async () => {
    await dispatch(getProfile());
    setIsLoading(false);
  };

  useEffect(() => {
    getSelfProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <Outlet />;
};

export default RootLayout;

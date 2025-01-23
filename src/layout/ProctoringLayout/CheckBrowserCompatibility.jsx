import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const CheckBrowserCompatibility = () => {
  const [isChrome, setIsChrome] = useState(true);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isChromeBrowser =
      userAgent.includes("chrome") && !userAgent.includes("edg");
    setIsChrome(isChromeBrowser);
  }, []);

  if (!isChrome) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        This webiste is only accessible via chrome browser
      </div>
    );
  }

  return <Outlet />;
};

export default CheckBrowserCompatibility;

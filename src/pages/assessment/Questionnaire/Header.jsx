import LoadingSpinner from "@/components/shared/LoaderSpinner";
import OutlinedBadge from "@/components/shared/OutlinedBadge";
import { Button } from "@/lib/ui/button";
import { formatTimeFromSeconds, getRemainingTime } from "@/utils/methods";
import { Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WebCam from "./WebCam";

const Header = ({
  testStartedAt,
  duration,
  handleSubmit,
  isLoading,
  isReportLoading,
}) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [submitAlert, setSubmitAlert] = useState(false);

  const updateRemainingTime = () => {
    const timeLeft = getRemainingTime(testStartedAt, duration);

    if (timeLeft > 0 && timeLeft <= 60 && !submitAlert) {
      setSubmitAlert(true);
      setRemainingTime(formatTimeFromSeconds(timeLeft));
    } else if (timeLeft === 0) {
      setRemainingTime(formatTimeFromSeconds(timeLeft));
      handleSubmit();
    } else {
      setRemainingTime(formatTimeFromSeconds(timeLeft));
    }
  };

  useEffect(() => {
    const intervalId = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStartedAt, duration]);

  const alertStyles = submitAlert
    ? "!text-red-500 animate-ping"
    : "text-yellow-500";

  return (
    <div className="bg-gray-100 w-full h-[26vh] p-4 flex justify-between">
      <div className="bg-white w-72 flex justify-center items-center rounded-xl ">
        <WebCam />
      </div>
      <div className="flex flex-col justify-between items-end">
        <OutlinedBadge
          title="Time Left"
          description={remainingTime}
          icon={<Timer className={alertStyles} />}
          mainClassName="border border-gray-300 !bg-gray-200 text-gray-700"
          descriptionClassName={alertStyles}
        />
        <Button
          size="sm"
          disabled={isLoading || isReportLoading}
          onClick={handleSubmit}
        >
          {isLoading ? <LoadingSpinner /> : "End Test"}
        </Button>
      </div>
    </div>
  );
};

export default Header;

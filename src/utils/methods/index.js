export const formatFileSize = (size) => {
  return (size / (1024 * 1024)).toFixed(2);
};

export function formatTime(x) {
  const hours = Math.floor(x / 3600);
  const minutes = Math.floor((x % 3600) / 60);
  const seconds = x % 60;

  // Construct the result string
  let result = "";
  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    if (result) result += " ";
    result += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  if (seconds > 0) {
    if (result) result += " ";
    result += `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return result || "0 seconds";
}

export const formatTimeFromSeconds = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours,
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

export const getRemainingTime = (startedAt, duration) => {
  const startTime = new Date(startedAt).getTime();
  const currentTime = Date.now();
  const elapsedTime = (currentTime - startTime) / 1000;
  const remainingTime = duration - elapsedTime;
  return Math.max(0, Math.floor(remainingTime));
};

export const getPaginationItems = (page, data) => {
  let itemsPerPage = 10;
  const startIndex = Math.floor(page / itemsPerPage) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

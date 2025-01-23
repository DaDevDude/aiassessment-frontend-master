import { Toaster } from "@/lib/ui/toaster";
import { Fragment } from "react";

const ToastProvider = ({ children }) => {
  return (
    <Fragment>
      {children}
      <Toaster />
    </Fragment>
  );
};

export default ToastProvider;

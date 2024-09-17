import { useCallback } from "react";
import toast, { ToastOptions } from "react-hot-toast";
import { useTheme } from "next-themes";

const useToast = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const style = {
    borderRadius: "100px",
    background: isDarkMode ? "#333" : "#fff",
    color: isDarkMode ? "#fff" : "#333",
  };

  const myToast = (message: string, options?: ToastOptions) => {
    toast(message, { style, ...options });
  };

  myToast.error = (message: string, options?: ToastOptions) => {
    toast.error(message, { style, ...options });
  };

  myToast.warning = (message: string, options?: ToastOptions) => {
    toast.error(message, { style, icon: "⚠️", ...options });
  };

  myToast.success = (message: string, options?: ToastOptions) => {
    toast.success(message, { style, ...options });
  };

  myToast.auto = (promise: Promise<{ status: boolean; msg: string }>, options?: ToastOptions) => {
    promise.then((res) => {
      if (res.status) {
        myToast.success(res.msg, options);
      } else {
        myToast.error(res.msg, options);
      }
    });
  };

  return useCallback(myToast, [isDarkMode]);
};

export default useToast;

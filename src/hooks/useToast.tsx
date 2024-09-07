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

  myToast.promise = (promise: Promise<string>, options?: ToastOptions) => {
    toast.promise(
      promise,
      {
        loading: "Loading...",
        success: (res) => <b>{res}</b>,
        error: (err) => {
          return <b>{err}</b>;
        },
      },
      { style, ...options },
    );
  };

  return useCallback(myToast, [isDarkMode]);
};

export default useToast;

import { useCallback } from "react";
import toast, { ToastOptions } from "react-hot-toast";
import { useTheme } from "next-themes";

const useToast = (notificationScope: number) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const style = {
    borderRadius: "100px",
    background: isDarkMode ? "#333" : "#fff",
    color: isDarkMode ? "#fff" : "#333",
  };

  /**
   * 消息优先级（默认消息优先级是 2）
   * 1: 通常是错误消息以及一些重要的消息
   * 2: 一些不重要的成功类型的消息
   * */

  const isNotify = (messagePriority?: 1 | 2) =>
    (messagePriority && messagePriority <= notificationScope) || (!messagePriority && 2 <= notificationScope);

  const myToast = (message: string, options?: ToastOptions & { messagePriority?: 1 | 2 }) => {
    if (isNotify(options?.messagePriority)) {
      toast(message, { style, ...options });
    }
  };

  myToast.error = (message: string, options?: ToastOptions & { messagePriority?: 1 | 2 }) => {
    if (isNotify(options?.messagePriority)) {
      toast.error(message, { style, ...options });
    }
  };

  myToast.warning = (message: string, options?: ToastOptions & { messagePriority?: 1 | 2 }) => {
    if (isNotify(options?.messagePriority)) {
      toast.error(message, { style, icon: "⚠️", ...options });
    }
  };

  myToast.success = (message: string, options?: ToastOptions & { messagePriority?: 1 | 2 }) => {
    if (isNotify(options?.messagePriority)) {
      toast.success(message, { style, ...options });
    }
  };

  myToast.auto = (promise: Promise<{ status: boolean; msg: string }>, options?: ToastOptions) => {
    promise.then((res) => {
      res.status
        ? myToast.success(res.msg, { ...options, messagePriority: 2 })
        : myToast.error(res.msg, { ...options, messagePriority: 1 });
    });
  };

  return useCallback(myToast, [isDarkMode, notificationScope]);
};

export default useToast;

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    // 清除之前的定时器
    clearTimeout(timeoutId);

    // 设置一个新的定时器
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
}

export function formatDateString(year: number, month: number, day: number): string {
  // 将月和日格式化为两位数
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  // 组合成 YYYY-MM-DD 格式的字符串
  return `${year}-${formattedMonth}-${formattedDay}`;
}

export function generateLocalID() {
  return new Date().getTime().toString(36) + Math.random().toString(36).slice(2, 9);
}

// TODO: 完善文件输入功能
export function readFile(accept: string = ""): Promise<File | null> {
  const inputEl = document.createElement("input");
  inputEl.type = "file";
  inputEl.accept = accept;
  inputEl.multiple = false;

  return new Promise((resolve, reject) => {
    const onChange = () => {
      if (inputEl.files) {
        resolve(inputEl.files[0]);
        cleanup();
      }
    };

    const onWindowClick = () => {
      if (!inputEl.value) {
        reject(new Error("用户取消选择"));
      }
      cleanup();
    };

    const cleanup = () => {
      inputEl.removeEventListener("change", onChange);
      window.removeEventListener("click", onWindowClick, true);
    };

    inputEl.addEventListener("change", onChange);
    setTimeout(() => window.addEventListener("click", onWindowClick, true), 100);
    inputEl.click();
  });
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
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

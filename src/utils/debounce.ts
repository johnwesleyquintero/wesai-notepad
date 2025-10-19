export const debounce = <Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number,
): ((...args: Args) => void) => {
  let timeout: number | null;

  return (...args: Args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, delay);
  };
};

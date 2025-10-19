import { debounce } from "../debounce";

describe("debounce", () => {
  jest.useFakeTimers();

  it("should debounce the function calls", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    // Function should not have been called yet
    expect(func).not.toHaveBeenCalled();

    // Advance timers by less than the debounce delay
    jest.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();

    // Advance timers by the debounce delay
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should call the function with the latest arguments", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc(1);
    debouncedFunc(2);
    debouncedFunc(3);

    jest.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(3);
  });

  it("should reset the timer if called again before delay", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc(1);
    jest.advanceTimersByTime(50);
    debouncedFunc(2); // This should reset the timer
    jest.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(2);
  });

  it("should work correctly with a delay of 0", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 0);

    debouncedFunc(1);
    debouncedFunc(2);

    jest.advanceTimersByTime(0); // Advance by 0 to allow immediate execution

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(2);
  });

  it("should allow subsequent calls after the debounce period", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc(1);
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1);

    debouncedFunc(2);
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenCalledWith(2);
  });
});

import { renderHook, act } from "@testing-library/react";
import { useUndoRedo } from "../useUndoRedo";

describe("useUndoRedo", () => {
  it("should return the initial state", () => {
    const { result } = renderHook(() => useUndoRedo(0));
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("should update state and allow undo/redo", () => {
    const { result } = renderHook(() => useUndoRedo(0));

    act(() => {
      result.current.setState(1);
    });
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    act(() => {
      result.current.setState(2);
    });
    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.redo();
    });
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.redo();
    });
    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("should clear future history when a new state is set after undo", () => {
    const { result } = renderHook(() => useUndoRedo(0));

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
      result.current.undo(); // State is 1
    });
    expect(result.current.state).toBe(1);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.setState(3); // This should clear '2' from redo history
    });
    expect(result.current.state).toBe(3);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false); // Redo history should be cleared
  });

  it("should handle skipHistory option correctly", () => {
    const { result } = renderHook(() => useUndoRedo(0));

    act(() => {
      result.current.setState(1);
      result.current.setState(2, { skipHistory: true }); // Should overwrite 1, not add new history
    });
    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(false); // No undo since 1 was overwritten
    expect(result.current.canRedo).toBe(false);

    act(() => {
      result.current.setState(3);
    });
    expect(result.current.state).toBe(3);
    expect(result.current.canUndo).toBe(true);
  });

  it("should limit history size", () => {
    const { result } = renderHook(() => useUndoRedo(0));

    for (let i = 1; i <= 60; i++) {
      act(() => {
        result.current.setState(i);
      });
    }

    // History size should be MAX_HISTORY_SIZE (50)
    // The current state is 60, so the history should contain 11 to 60
    act(() => {
      result.current.undo(); // 59
      result.current.undo(); // 58
    });
    expect(result.current.state).toBe(58);

    // Try to undo beyond the limit
    for (let i = 0; i < 50; i++) {
      act(() => {
        result.current.undo();
      });
    }
    // The earliest state should be 11 (initial state 0 + 10 skipped due to limit)
    expect(result.current.state).toBe(11);
    expect(result.current.canUndo).toBe(false);
  });
});

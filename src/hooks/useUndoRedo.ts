import { useState, useRef, useCallback } from "react";

const MAX_HISTORY_SIZE = 50; // Limit the number of undo/redo states

export const useUndoRedo = <T>(initialState: T) => {
  const history = useRef([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback(
    (newState: T, { skipHistory = false } = {}) => {
      if (skipHistory) {
        history.current[currentIndex] = newState;
        // If we skip history, we don't want to clear future states
        // but we do want to update the current state in history
      } else {
        // If we are not at the end of the history, clear future states
        if (currentIndex < history.current.length - 1) {
          history.current = history.current.slice(0, currentIndex + 1);
        }

        // Add new state to history
        history.current.push(newState);

        // Enforce MAX_HISTORY_SIZE
        if (history.current.length > MAX_HISTORY_SIZE) {
          history.current = history.current.slice(
            history.current.length - MAX_HISTORY_SIZE,
          );
        }
        setCurrentIndex(history.current.length - 1);
      }
    },
    [currentIndex],
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.current.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.current.length - 1;

  return {
    state: history.current[currentIndex],
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

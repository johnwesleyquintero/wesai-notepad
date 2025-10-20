import { useState, useRef, useCallback } from "react";

const MAX_HISTORY_SIZE = 50; // Limit the number of undo/redo states

export const useUndoRedo = <T>(initialState: T) => {
  const [state, setStateInternal] = useState<T>(initialState);
  const history = useRef([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback((newState: T, { skipHistory = false } = {}) => {
    setStateInternal(newState);
    if (skipHistory) {
      history.current = [newState];
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prevIndex) => {
        const newHistory = history.current.slice(0, prevIndex + 1);
        newHistory.push(newState);

        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.splice(0, newHistory.length - MAX_HISTORY_SIZE);
        }
        history.current = newHistory;
        return newHistory.length - 1;
      });
    }
  }, []);

  const undo = useCallback(() => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex >= 0) {
        setStateInternal(history.current[prevIndex]);
        return prevIndex;
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex < history.current.length) {
        setStateInternal(history.current[nextIndex]);
        return nextIndex;
      }
      return prev;
    });
  }, []);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.current.length - 1;

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing temporary state with automatic cleanup
 * @param initialValue Initial state value
 * @param duration Duration in milliseconds before auto-resetting
 * @returns [state, setState, clearState] tuple
 */
export function useTemporaryState<T>(
  initialValue: T,
  duration: number = 2000
): [T, (arg0: T) => void, () => void] {
  const [state, setState] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setTemporaryState = (newValue: T) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setState(newValue);
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setState(initialValue);
      timeoutRef.current = null;
    }, duration);
  };

  const clearState = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState(initialValue);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, setTemporaryState, clearState];
} 
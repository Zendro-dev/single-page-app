import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdown {
  timer: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  clearTimer: () => void;
}

export default function useCountdown(count = 0): UseCountdown {
  const timerId = useRef<number>();
  const [timer, setTimer] = useState(count);
  const [toggle, setToggle] = useState(false);

  useEffect(
    function updateTimer() {
      if (toggle) {
        const id = setInterval(() => {
          setTimer((state) => (state > 0 ? state - 1 : state));
        }, 1000);
        timerId.current = id as unknown as number;
      }
      return () => clearInterval(timerId.current);
    },
    [toggle]
  );

  useEffect(() => {
    if (timer === 0) clearTimer();
  });

  const clearTimer = (): void => clearInterval(timerId.current);
  const startTimer = useCallback((): void => setToggle(true), []);
  const stopTimer = useCallback((): void => setToggle(false), []);
  const resetTimer = useCallback((): void => {
    stopTimer();
    setTimer(count);
  }, [count, stopTimer]);

  return { timer, startTimer, stopTimer, resetTimer, clearTimer };
}

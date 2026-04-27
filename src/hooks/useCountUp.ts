import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

type UseCountUpOptions = {
  end: number;
  duration?: number;
  loopDelay?: number;
};

export function useCountUp({
  end,
  duration = 1800,
  loopDelay = 1200,
}: UseCountUpOptions): number {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(reduced ? end : 0);

  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setCurrent(end);
      return;
    }

    function cancel() {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    function start() {
      startTimeRef.current = null;

      function tick(timestamp: number) {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(end * easeOutQuad(progress));
        setCurrent(value);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCurrent(end);
          timerRef.current = setTimeout(() => {
            setCurrent(0);
            start();
          }, loopDelay);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    start();
    return cancel;
  }, [end, duration, loopDelay, reduced]);

  return current;
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Performance monitoring hook
export const usePerformance = () => {
  const metricsRef = useRef<any[]>([]);

  const measurePerformance = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    const duration = end - start;
    
    metricsRef.current.push({
      name,
      duration,
      timestamp: Date.now()
    });
    
    if (duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }
  }, []);

  const getMetrics = useCallback(() => {
    return metricsRef.current.slice();
  }, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
  }, []);

  return { measurePerformance, getMetrics, clearMetrics };
};

// Debounce hook for performance optimization
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const throttledCallback = useRef<T>(callback);
  const lastRun = useRef<number>(0);

  useEffect(() => {
    throttledCallback.current = callback;
  }, [callback]);

  return useMemo(() => {
    return ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        throttledCallback.current(...args);
        lastRun.current = now;
      }
    }) as T;
  }, [delay]);
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};


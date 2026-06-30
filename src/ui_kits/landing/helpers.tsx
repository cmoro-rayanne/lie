import React from 'react';

// Shared reveal-on-scroll hook for the landing UI kit.
window.useInView = function useInView(threshold: number = 0.15) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [inView, setInView] = React.useState<boolean>(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]: IntersectionObserverEntry[]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold, rootMargin: '0px 0px -60px 0px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};


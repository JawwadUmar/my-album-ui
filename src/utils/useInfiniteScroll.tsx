// utils/useInfiniteScroll.ts
import { useEffect, useRef } from "react";

const useInfiniteScroll = (loadMore: () => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { threshold: 1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return ref;
};

export default useInfiniteScroll;
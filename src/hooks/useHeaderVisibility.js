// 역할: 스크롤 방향에 따라 상단 헤더의 표시 여부를 제어합니다.
import { useEffect, useRef, useState } from "react";

const TOP_OFFSET = 24;
const HIDE_OFFSET = 88;
const DELTA_THRESHOLD = 8;

export default function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY <= TOP_OFFSET) {
        setIsVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      if (Math.abs(delta) < DELTA_THRESHOLD) {
        lastScrollY.current = currentY;
        return;
      }

      if (delta > 0 && currentY > HIDE_OFFSET) {
        setIsVisible(false);
      } else if (delta < 0) {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isVisible;
}

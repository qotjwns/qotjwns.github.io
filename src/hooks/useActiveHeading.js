import { useEffect, useState } from "react";

export default function useActiveHeading(headings) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? null);

  useEffect(() => {
    if (!headings.length || typeof window === "undefined") {
      setActiveId(null);
      return undefined;
    }

    const updateActiveHeading = () => {
      let nextActiveId = headings[0]?.id ?? null;

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (!element) {
          return;
        }

        if (element.getBoundingClientRect().top <= 140) {
          nextActiveId = heading.id;
        }
      });

      setActiveId(nextActiveId);
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {  
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headings]);

  return activeId;
}

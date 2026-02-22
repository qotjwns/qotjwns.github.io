// 역할: 지정한 의존성이 바뀔 때 페이지 최상단으로 스크롤합니다.
import { useEffect } from "react";

export default function useScrollTop(deps = []) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, deps);
}

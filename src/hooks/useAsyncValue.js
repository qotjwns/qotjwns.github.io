// 역할: 비동기 요청의 로딩/성공/실패 상태를 공통으로 관리합니다.
import { useEffect, useState } from "react";

export default function useAsyncValue(factory, deps, initialValue = null) {
  const [data, setData] = useState(initialValue);
  const [state, setState] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setState("loading");
    setError(null);
    setData(initialValue);

    Promise.resolve()
      .then(() => factory())
      .then((value) => {
        if (!active) {
          return;
        }
        setData(value);
        setState("ready");
      })
      .catch((err) => {
        if (!active) {
          return;
        }
        setError(err);
        setState("error");
      });

    return () => {
      active = false;
    };
  }, deps);

  return { data, setData, state, error };
}

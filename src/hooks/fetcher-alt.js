import * as React from "react";
import { fetchingReducer } from "hooks/fetcher";

import { errorsUtil } from "utils";

function useFetcher() {
  const [state, dispatch] = React.useReducer(fetchingReducer, {
    status: "idle",
    data: null,
    errors: null,
  });
  const isMounted = useUnmountChecker();
  const { status } = state;

  const runAsync = async (serviceFetcher, { onSuccess, onError, transform } = {}) => {
    if (typeof serviceFetcher !== "function") {
      return;
    }

    dispatch({ status: "loading", errors: null });
    const result = await serviceFetcher();

    // Cegah memory leak
    // Gak perlu update state kalau sudah unmount
    if (!isMounted.current) {
      return;
    }

    if (result.success) {
      dispatch({
        status: "success",
        data: typeof transform === "function" ? transform(result.data) : result.data,
      });
      onSuccess?.();
    } else {
      const fetchingErrors = errorsUtil.interpretServerErrors(result);
      dispatch({ status: "error", errors: fetchingErrors });
      onError?.();
    }
  };

  // Pertimbangkan, di reducer ada reset, tapi masih pakai state `attempts`
  const reset = () => dispatch({ status: "idle", errors: null, data: null });

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "errors";

  return { ...state, state, runAsync, reset, isLoading, isSuccess, isError };
}

function useUnmountChecker() {
  const isMountedRef = React.useRef(false);

  // Cek mounting komponen
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}

export { useFetcher };

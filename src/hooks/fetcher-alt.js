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
      const data = _buildDataState(result.data, transform);
      dispatch({ status: "success", data: data });
      onSuccess?.(data);
    } else {
      const fetchingErrors = errorsUtil.interpretServerErrors(result);
      dispatch({ status: "error", errors: fetchingErrors });
      onError?.(fetchingErrors);
    }
  };

  // Pertimbangkan, di reducer ada reset, tapi masih pakai state `attempts`
  const reset = () => dispatch({ status: "idle", errors: null, data: null });

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

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

function _buildDataState(data, transform) {
  if (!data || typeof transform !== "function") {
    return data;
  }
  return transform(data);
}

export { useFetcher };

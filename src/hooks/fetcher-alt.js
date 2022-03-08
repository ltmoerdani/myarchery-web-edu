import * as React from "react";
import { fetchingReducer } from "hooks/fetcher";

import { errorsUtil } from "utils";

function useFetcher() {
  const [state, dispatch] = React.useReducer(fetchingReducer, {
    status: "idle",
    data: null,
    errors: null,
  });

  const { status } = state;

  const runAsync = async (serviceFetcher, { onSuccess, onError, transform } = {}) => {
    if (typeof serviceFetcher !== "function") {
      return;
    }

    dispatch({ status: "loading", errors: null });

    const result = await serviceFetcher();
    if (result.success) {
      const resultData = typeof transform === "function" ? transform(result.data) : result.data;
      dispatch({
        status: "success",
        data: resultData,
      });
      onSuccess?.(resultData);
    } else {
      const fetchingErrors = errorsUtil.interpretServerErrors(result);
      dispatch({ status: "error", errors: fetchingErrors });
      onError?.(fetchingErrors);
    }
  };

  // Pertimbangkan, di reducer ada reset, tapi masih pakai state `attempts`
  const reset = () => dispatch({ status: "idle", errors: null, data: null });
  const setLoading = () => dispatch({ status: "loading", errors: null });
  const setSuccess = (data) => {
    const action = { status: "success" };
    if (data) {
      action.data = data;
    }
    dispatch(action);
  };
  const setError = (errors) => {
    const action = { status: "error" };
    if (errors) {
      action.errors = errors;
    }
    dispatch(action);
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "errors";

  return {
    ...state,
    state,
    runAsync,
    reset,
    setLoading,
    setSuccess,
    setError,
    isLoading,
    isSuccess,
    isError,
  };
}

export { useFetcher };

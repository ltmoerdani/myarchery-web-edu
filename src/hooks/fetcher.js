import * as React from "react";

function useFetcher(fetcherFunction, { shouldFetch, reducer = fetchingReducer, transform } = {}) {
  const [state, dispatch] = React.useReducer(reducer, {
    status: "idle",
    data: null,
    errors: null,
    attempts: 1,
  });

  const { attempts } = state;

  React.useEffect(() => {
    const shouldPreventFetch = () => {
      if (typeof shouldFetch === "undefined") {
        return false;
      }
      return !shouldFetch;
    };

    if (shouldPreventFetch()) {
      return;
    }

    const fetchData = async () => {
      dispatch({ status: "loading", errors: null });
      const result = await fetcherFunction();
      if (result.success) {
        const makeData = (data) => (typeof transform === "function" ? transform(data) : data);
        const data = makeData(result.data);
        dispatch({ status: "success", data: data });
      } else {
        dispatch({ status: "error", errors: result.errors || result.message });
      }
    };
    fetchData();
  }, [attempts]);

  const refetch = () => dispatch({ type: "REFETCH" });
  const reset = (preferedDefaultData) => dispatch({ type: "RESET", payload: preferedDefaultData });

  return { ...state, state, dispatch, refetch, reset };
}

function fetchingReducer(state, action) {
  if (action.type === "REFETCH") {
    return { ...state, attempts: state.attempts + 1 };
  }
  if (action.type === "RESET") {
    return {
      status: "idle",
      data: typeof action.payload !== "undefined" ? action.payload : null,
      errors: null,
      attempts: 1,
    };
  }
  return { ...state, ...action };
}

export { useFetcher, fetchingReducer };

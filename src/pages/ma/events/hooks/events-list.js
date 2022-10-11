import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { Landingpage } from "services";

function useEventsList() {
  const fetcher = useFetcher();

  React.useEffect(() => {
    // TODO: (1.) get pakai pagination
    // TODO: (2.) get pakai filter
    const getFunction = () => {
      return Landingpage.getEvent({ limit: 30 });
    };

    fetcher.runAsync(getFunction);
  }, []);

  const isSettled = fetcher.data || (!fetcher.data && fetcher.isError);

  return { ...fetcher, isSettled };
}

export { useEventsList };

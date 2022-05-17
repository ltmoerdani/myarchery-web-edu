import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { Landingpage } from "services";

function useEventsList() {
  const fetcher = useFetcher();

  React.useEffect(() => {
    const getFunction = () => {
      return Landingpage.getEvent({ limit: 4 });
    };

    fetcher.runAsync(getFunction);
  }, []);

  const isSettled = fetcher.data || (!fetcher.data && fetcher.isError);

  return { ...fetcher, isSettled };
}

export { useEventsList };

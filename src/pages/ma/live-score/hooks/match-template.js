import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { Elimination } from "services";

const POLLING_INTERVAL = 10000;

function useMatchTemplate(eventCategoryId, isEventEnded) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventCategoryId) {
      return;
    }

    const fetcherCallback = async () => {
      return Elimination.getEventElimination({ event_category_id: eventCategoryId });
    };

    const getData = () => {
      fetcher.runAsync(fetcherCallback, {
        onError() {
          fetcher.reset();
        },
      });
    };
    getData();

    if (isEventEnded) {
      return;
    }

    const matchesPollingTimer = setInterval(() => {
      getData();
    }, POLLING_INTERVAL);

    // clean up
    return () => clearInterval(matchesPollingTimer);
  }, [eventCategoryId, isEventEnded]);

  return fetcher;
}

export { useMatchTemplate };

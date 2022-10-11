import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventsService } from "services";

function useEventRanksClubs(eventId, params) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    fetcher.runAsync(() => {
      return EventsService.getEventRanksClubs({ ...params, event_id: eventId });
    });
  }, [eventId, params]);

  return fetcher;
}

export { useEventRanksClubs };

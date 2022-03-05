import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventsService } from "services";

function useEventRanksClubs(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    fetcher.runAsync(() => {
      return EventsService.getEventRanksClubs({ event_id: eventId });
    });
  }, [eventId]);

  return fetcher;
}

export { useEventRanksClubs };
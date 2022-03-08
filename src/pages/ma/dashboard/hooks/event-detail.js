import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventsService } from "services";

function useEventDetail(eventId) {
  const eventDetail = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    eventDetail.runAsync(() => {
      return EventsService.getEventDetailById({ event_id: eventId });
    });
  }, [eventId]);

  return eventDetail;
}

export { useEventDetail };

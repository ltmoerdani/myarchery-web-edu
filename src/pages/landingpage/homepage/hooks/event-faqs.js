import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { FaqService } from "services";

function useEventFAQ(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    const getFunction = () => {
      return FaqService.getListFaq({ event_id: eventId, limit: 30 });
    };

    fetcher.runAsync(getFunction);
  }, [eventId]);

  return { ...fetcher };
}

export { useEventFAQ };

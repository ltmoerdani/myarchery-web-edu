import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventQualificationService } from "services";

const POLLING_INTERVAL = 10000;

function useParticipantScorings(categoryDetailId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }

    const fetcherCallback = async () => {
      return EventQualificationService.getParticipantScoring({
        event_category_id: categoryDetailId,
      });
    };

    fetcher.runAsync(fetcherCallback);

    const scoringPollingTimer = setInterval(() => {
      fetcher.runAsync(fetcherCallback);
    }, POLLING_INTERVAL);

    // clean up
    return () => clearInterval(scoringPollingTimer);
  }, [categoryDetailId]);

  return fetcher;
}

export { useParticipantScorings };

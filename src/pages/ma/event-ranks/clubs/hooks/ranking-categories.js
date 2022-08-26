import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { GeneralService } from "services";

function useRankingCategories(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    fetcher.runAsync(() => {
      return GeneralService.getClubRankingCategories({ event_id: eventId });
    });
  }, [eventId]);

  return fetcher;
}

export { useRankingCategories };

import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { CategoryService } from "services";

function useCategoriesByGender(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    const getFunction = () => CategoryService.getCategoryv2({ event_id: eventId });
    fetcher.runAsync(getFunction);
  }, [eventId]);

  return fetcher;
}

export { useCategoriesByGender };

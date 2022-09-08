import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { CategoryService } from "services";

function useCategoryDetails(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    const getFunction = () => {
      return CategoryService.getCategoryv2({ event_id: eventId });
    };

    fetcher.runAsync(getFunction);
  }, [eventId]);

  return { ...fetcher };
}

export { useCategoryDetails };

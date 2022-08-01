import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventsService } from "services";

function useCategoriesByTeam(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    const getFunction = () => {
      return EventsService.getCategory({ event_id: eventId });
    };
    fetcher.runAsync(getFunction, { transform: _checkDataContainingMarathon });
  }, [eventId]);

  return { ...fetcher };
}

function _checkDataContainingMarathon(data) {
  // Assign flag `isMarathon` ke masing-masing item kategori detail-nya
  const categoriesWithMarathonFlag = { ...data };
  for (const teamCategory in data) {
    categoriesWithMarathonFlag[teamCategory] = data[teamCategory].map((category) => ({
      ...category,
      isMarathon: Boolean(category.isMarathon),
    }));
  }

  return categoriesWithMarathonFlag;
}

export { useCategoriesByTeam };

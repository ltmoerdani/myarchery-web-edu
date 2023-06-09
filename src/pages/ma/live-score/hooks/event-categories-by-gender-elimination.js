import * as React from "react";
import { useFetcher } from "hooks/fetcher";
import { EventsService } from "services";

function useCategoriesByGenderElimination(eventId) {
  const getCategoryDetails = () => EventsService.getCategory({ event_id: eventId });
  const options = { shouldFetch: Boolean(eventId) };
  const fetcher = useFetcher(getCategoryDetails, options);
  const groupNames = makeGroupNames(fetcher.data);

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetcher.refetch();
  }, [eventId]);

  return { ...fetcher, groupNames };
}

function makeGroupNames(data) {
  if (!data) return [];

  // ambil key yang ada datanya aja.
  const filteredNames = [];
  for (const name of Object.keys(data)) {
    if (!data[name]) {
      continue;
    }
    filteredNames.push(name);
  }

  return filteredNames.sort((teamCategory) => {
    return teamCategory === "individu male" ? -1 : 0;
  });
}

export { useCategoriesByGenderElimination };

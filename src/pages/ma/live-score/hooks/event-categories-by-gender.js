import * as React from "react";
import { useFetcher } from "hooks/fetcher";
import { EventsService } from "services";

function useCategoriesByGender(eventId) {
  const getCategoryDetails = () => EventsService.getCategory({ event_id: eventId });
  const options = { shouldFetch: Boolean(eventId), transform };
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

function transform(data) {
  const filteredGroups = {};
  // ambil key yang ada datanya aja.
  for (const name of ["individu male", "individu female", "maleTeam", "femaleTeam", "mixTeam"]) {
    if (!data[name]) {
      continue;
    }
    filteredGroups[name] = data[name].map((category) => {
      const checkWhichTeamType = (id) => {
        if (id === "individu male" || id === "individu female") {
          return "individu";
        }
        if (id === "male_team" || id === "female_team" || id === "mix_team") {
          return "team";
        }
      };
      const type = checkWhichTeamType(category.teamCategoryId);
      return { ...category, type };
    });
  }
  return filteredGroups;
}

function makeGroupNames(data) {
  if (!data) return [];

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

export { useCategoriesByGender };

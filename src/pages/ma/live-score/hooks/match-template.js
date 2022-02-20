import * as React from "react";
import { useFetcher } from "hooks/fetcher";
import { Elimination } from "services";

function useMatchTemplate(eventCategoryId) {
  const getTemplate = () => {
    return Elimination.getEventElimination({
      match_type: 1,
      event_category_id: eventCategoryId,
      elimination_member_count: 16,
    });
  };
  const matches = useFetcher(getTemplate, { shouldFetch: Boolean(eventCategoryId) });

  React.useEffect(() => {
    if (!eventCategoryId) {
      return;
    }
    matches.refetch();
  }, [eventCategoryId]);

  return matches;
}

export { useMatchTemplate };

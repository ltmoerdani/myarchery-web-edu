import * as React from "react";
import { useFetcher } from "hooks/fetcher";
import { EventQualificationService } from "services";

const { getParticipantScoring } = EventQualificationService;

function useParticipantScorings(categoryDetailId) {
  const config = { shouldFetch: Boolean(categoryDetailId) };
  const scorings = useFetcher(
    () => getParticipantScoring({ event_category_id: categoryDetailId }),
    config
  );

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }
    scorings.refetch();
  }, [categoryDetailId]);

  return scorings;
}

export { useParticipantScorings };

import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventQualificationService } from "services";

const POLLING_INTERVAL = 10000;

function useParticipantScorings(categoryDetailId, teamType) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }

    const fetcherCallback = async () => {
      const queryParams = { event_category_id: categoryDetailId };
      return EventQualificationService.getParticipantScoring(queryParams);
    };

    const getData = () => {
      const options = { transform: getDataTransformer(teamType) };
      fetcher.runAsync(fetcherCallback, options);
    };

    getData();

    const scoringPollingTimer = setInterval(() => {
      getData();
    }, POLLING_INTERVAL);

    // clean up
    return () => clearInterval(scoringPollingTimer);
  }, [categoryDetailId]);

  return fetcher;
}

function getDataTransformer(teamType) {
  return (originalData) => {
    if (!originalData) {
      return [];
    }

    if (teamType === "individu") {
      const checkMemberIds = new Set();
      return originalData.filter((row) => {
        return !checkMemberIds.has(row.member.id) && checkMemberIds.add(row.member.id);
      });
    }

    if (teamType === "team") {
      const checkParticipantIds = new Set();
      return originalData.filter((row) => {
        return (
          !checkParticipantIds.has(row.participantId) && checkParticipantIds.add(row.participantId)
        );
      });
    }

    return originalData;
  };
}

export { useParticipantScorings };

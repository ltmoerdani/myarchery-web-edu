import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventQualificationService } from "services";

const POLLING_INTERVAL = 10000;

function useSelectionScorings(categoryDetailId, teamType, scoreType, isEventEnded) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }

    const fetcherCallback = async () => {
      if(scoreType == 4){
        return EventQualificationService.getSelectionElemination({ event_category_id: categoryDetailId});
      }
      const queryParams = { event_category_id: categoryDetailId, score_type: scoreType }
      return EventQualificationService.getSelectionScoring(queryParams);
    };

    const getData = () => {
      const options = { transform: getDataTransformer(teamType) };
      fetcher.runAsync(fetcherCallback, options);
    };

    getData();

    if (isEventEnded) {
      return;
    }

    const scoringPollingTimer = setInterval(() => {
      getData();
    }, POLLING_INTERVAL);

    // clean up
    return () => clearInterval(scoringPollingTimer);
  }, [categoryDetailId, scoreType, isEventEnded]);

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

export { useSelectionScorings };

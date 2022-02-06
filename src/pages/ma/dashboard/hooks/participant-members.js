import * as React from "react";
import { EventsService } from "services";

function useParticipantMembers(orderId) {
  const [state, dispatch] = React.useReducer(participantMembersReducer, {
    status: "idle",
    data: null,
    errors: null,
    attempts: 0,
  });

  const { attempts } = state;

  React.useEffect(() => {
    const fetchParticipantMembers = async () => {
      dispatch({ status: "loading", errors: null });
      const result = await EventsService.getEventMembersByParticipantId({
        participant_id: orderId,
      });
      if (result.success) {
        dispatch({ status: "success", data: result.data });
      } else {
        dispatch({ status: "error", errors: result.errors });
      }
    };

    fetchParticipantMembers();
  }, [attempts]);

  function refetchParticipantMembers() {
    dispatch({ type: "REFETCH" });
  }

  return {
    ...state,
    participantMembersState: state,
    dispatchParticipantMembersState: dispatch,
    refetchParticipantMembers,
  };
}

function participantMembersReducer(state, action) {
  if (action.type === "REFETCH") {
    return { ...state, attempts: state.attempts + 1 };
  }
  return { ...state, ...action };
}

export { useParticipantMembers };

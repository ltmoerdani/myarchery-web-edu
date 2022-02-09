import * as React from "react";
import { EventsService } from "services";

function useEventDetail(eventId) {
  const [eventState, dispatchEventState] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      status: "idle",
      data: null,
      errors: null,
    }
  );

  React.useEffect(() => {
    const fetchEventDetail = async () => {
      dispatchEventState({ status: "loading", errors: null });
      const result = await EventsService.getEventDetailById({ event_id: eventId });
      if (result.success) {
        dispatchEventState({ status: "success", data: result.data });
      } else {
        dispatchEventState({ status: "error", errors: result.errors });
      }
    };

    fetchEventDetail();
  }, []);

  return { ...eventState, eventState, dispatchEventState };
}

export { useEventDetail };

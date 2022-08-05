import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventsService } from "services";

function useEventDetail(slug) {
  const fetcher = useFetcher();

  const fetchEventDetail = (options) => {
    const getFunction = () => {
      return EventsService.getDetailEvent({ slug });
    };
    fetcher.runAsync(getFunction, options);
  };

  React.useEffect(() => {
    if (!slug) {
      return;
    }
    fetchEventDetail();
  }, [slug]);

  return { ...fetcher, fetchEventDetail };
}

export { useEventDetail };

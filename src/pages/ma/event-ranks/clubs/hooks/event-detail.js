import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventsService } from "services";

function useEventDetail(slug) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!slug) {
      return;
    }

    fetcher.runAsync(() => {
      return EventsService.getDetailEvent({ slug: slug });
    });
  }, [slug]);

  return fetcher;
}

export { useEventDetail };

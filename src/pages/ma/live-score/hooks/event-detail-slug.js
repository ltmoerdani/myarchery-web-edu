import { useFetcher } from "hooks/fetcher";
import { EventsService } from "services";

function useEventDetailFromSlug(slug) {
  const getEvent = () => EventsService.getDetailEvent({ slug });
  return useFetcher(getEvent);
}

export { useEventDetailFromSlug };

import { useFetcher } from "hooks/fetcher-alt";
import { OrderEventService } from "services";

// import { datetime } from "utils";

function useSubmitOrder(formData) {
  const fetcher = useFetcher();

  const submit = (options, eventDetailData) => {
    const postFunction = () => {
      const { dataParticipant, selectCategoryUser, city_id, club } = formData;
      const payload = {
        event_id: selectCategoryUser?.eventId,
        club_or_city_id:
          eventDetailData?.withContingent === 1
            ? city_id.value
            : club?.detail?.id ?? 0,
      };
      if (dataParticipant.length === 1) {
        payload.members = dataParticipant;
      }
      return OrderEventService.createOrder(payload);
    };

    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitOrder };

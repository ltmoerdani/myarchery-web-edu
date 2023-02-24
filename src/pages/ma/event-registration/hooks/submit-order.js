import { useFetcher } from "hooks/fetcher-alt";
import { OrderEventService } from "services";

// import { datetime } from "utils";

function useSubmitOrder(formData) {
  const fetcher = useFetcher();

  const submit = (options, eventDetailData, selectCategoriesType) => {
    const postFunction = () => {
      if (selectCategoriesType === "individual") {
        const { dataParticipant, selectCategoryUser, city_id, club } = formData;
        const payload = {
          event_id: selectCategoryUser?.eventId ?? eventDetailData?.id ?? 0,
          club_or_city_id:
            eventDetailData?.withContingent === 1
              ? city_id.value
              : club?.detail?.id ?? 0,
        };
        if (dataParticipant?.length) {
          payload.members = dataParticipant;
        }
        return OrderEventService.createOrder(payload);
      } else {
        const { numberOfTeam, selectCategoryUser, city_id, club } = formData;
        const payload = {
          event_id: selectCategoryUser?.eventId,
          total_slot: Number(numberOfTeam) ?? 0,
          club_or_city_id:
            eventDetailData?.withContingent === 1
              ? city_id.value
              : club?.detail?.id ?? 0,
          event_category_id: selectCategoryUser?.id,
        };
        return OrderEventService.createOrderTeam(payload);
      }
    };

    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitOrder };

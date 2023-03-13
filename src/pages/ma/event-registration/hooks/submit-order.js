import { useFetcher } from "hooks/fetcher-alt";
import { OrderEventService } from "services";

// import { datetime } from "utils";

function useSubmitOrder(formData) {
  const fetcher = useFetcher();

  const submit = (options, eventDetailData, selectCategoriesType) => {
    const postFunction = () => {
      if (selectCategoriesType === "individual") {
        const {
          dataParticipant,
          selectCategoryUser,
          city_id,
          club,
          classificationEvent,
          provinceData,
          countryData,
        } = formData;
        const payload = {
          event_id: selectCategoryUser?.eventId ?? eventDetailData?.id ?? 0,
          classification_children_id:
            eventDetailData?.parentClassification > 5
              ? classificationEvent?.value || null
              : null,
          classification_country:
            eventDetailData?.classificationCountryId ||
            countryData?.value ||
            null,
          classification_province:
            parseInt(
              eventDetailData?.classificationProvinceId || provinceData?.value
            ) || null,
          classification_city:
            eventDetailData?.parentClassification === 4
              ? city_id?.value ?? null
              : null,
          classification_club_id:
            eventDetailData?.parentClassification === 1
              ? club?.detail?.id ?? null
              : null,
        };
        if (dataParticipant?.length) {
          payload.members = dataParticipant;
        }
        return OrderEventService.createOrder(payload);
      } else {
        const {
          numberOfTeam,
          selectCategoryUser,
          city_id,
          club,
          classificationEvent,
          provinceData,
          countryData,
        } = formData;
        const payload = {
          event_id: selectCategoryUser?.eventId,
          total_slot: Number(numberOfTeam) ?? 0,
          classification_children_id:
            eventDetailData?.parentClassification > 5
              ? classificationEvent?.value || 0
              : 0,
          classification_country_id:
            eventDetailData?.classificationCountryId || countryData?.value || 0,
          classification_province_id:
            parseInt(
              eventDetailData?.classificationProvinceId || provinceData?.value
            ) || 0,
          classification_city_id:
            eventDetailData?.parentClassification === 4
              ? city_id?.value ?? 0
              : 0,
          classification_club_id:
            eventDetailData?.parentClassification === 1
              ? club?.detail?.id ?? 0
              : 0,
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

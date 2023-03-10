import * as React from "react";
import { useHistory } from "react-router-dom";
import { useFetcher } from "hooks/fetcher-alt";
import { OrderEventService } from "services";

function useBooking(category, isSuccess, eventDetailData, formOrder) {
  const { block } = useHistory();
  const fetcherBooking = useFetcher();
  const fetcherResetBooking = useFetcher();

  const { data: booking } = fetcherBooking;
  const { city_id, club, countryData, provinceData } = formOrder.data;
  const createBooking = () => {
    const postFunction = () => {
      return OrderEventService.createBooking(
        {
          classificationChildren: null,
          classificationCountryId:
            eventDetailData?.classificationCountryId ||
            countryData?.value ||
            null,
          classificationProvinceId:
            eventDetailData?.classificationProvinceId ||
            provinceData?.value ||
            null,
          classificationCityId:
            eventDetailData?.parentClassification === 4
              ? city_id?.value ?? null
              : null,
          classificationArcheryClub:
            eventDetailData?.parentClassification === 1
              ? club?.detail?.id ?? null
              : null,
        },
        {
          category_id: category.id
            ? category.id
            : category?.data?.map((e) => e.id),
        }
      );
    };
    fetcherBooking.runAsync(postFunction);
  };

  const deleteBooking = (participantId) => {
    const postFunction = () => {
      return OrderEventService.deleteBooking({
        participant_id: participantId || booking.participantId,
      });
    };
    fetcherResetBooking.runAsync(postFunction);
  };

  const deleteBookingOnBeforeUnload = (participantId) => {
    const postFunction = () => {
      return OrderEventService.deleteBookingKeepAlive({
        participant_id: participantId || booking.participantId,
      });
    };
    fetcherResetBooking.runAsync(postFunction);
  };

  React.useEffect(() => {
    if (!category) {
      return;
    }
    // `participantId` gak perlu dimasukkan ke list dependensi useEffect,
    // karena booking yang perlu di-delete di sini itu yang
    // `participantId`-nya masih yang "sebelumnya"
    // (kalau masuk dependensi justru bakal infinity loop)
    booking?.participantId && deleteBooking();
    createBooking();
  }, [category]);

  // Routing bawaan browser
  React.useEffect(() => {
    if (!booking?.participantId) {
      return;
    }

    if (isSuccess) {
      return;
    }

    const resetBeforeUnload = (ev) => {
      ev.preventDefault();
      deleteBookingOnBeforeUnload(booking?.participantId);
    };

    window.addEventListener("beforeunload", resetBeforeUnload);

    // clean up
    return () => {
      window.removeEventListener("beforeunload", resetBeforeUnload);
    };
  }, [booking?.participantId, isSuccess]);

  // Routing react-router
  React.useEffect(() => {
    if (!booking?.participantId) {
      return;
    }

    if (isSuccess) {
      return;
    }

    const unblock = block(() => {
      deleteBooking(booking?.participantId);
      unblock();
    });

    return unblock;
  }, [booking?.participantId, isSuccess]);

  return {
    ...fetcherBooking,
    createBooking,
    deleteBooking,
    deleteBookingOnBeforeUnload,
  };
}

export { useBooking };

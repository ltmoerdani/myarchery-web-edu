import { useFetcher } from "hooks/fetcher-alt";
import { OrderEventService } from "services";

import { datetime } from "utils";

function useSubmitOrder(formData) {
  const fetcher = useFetcher();

  const submit = (options) => {
    const postFunction = () => {
      const { category, matchDate, teamName, withClub, club, paymentMethode } = formData;

      const payload = {
        event_category_id: category.id,
        day_choice: datetime.formatServerDate(matchDate) || undefined,
        club_id: club?.detail.id || 0,
        team_name: teamName || undefined,
        with_club: withClub,
        payment_methode: paymentMethode,
      };

      return OrderEventService.register(payload);
    };

    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitOrder };

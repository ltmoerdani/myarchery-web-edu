import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { ArcherService } from "services";

function useVerificationDetail(userId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!userId) {
      return;
    }
    const getFuntion = () => {
      return ArcherService.getDetailVerifikasi({ user_id: userId });
    };
    fetcher.runAsync(getFuntion);
  }, [userId]);

  return fetcher;
}

export { useVerificationDetail };

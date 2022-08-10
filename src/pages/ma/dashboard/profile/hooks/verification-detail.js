import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { ArcherService } from "services";

function useVerificationDetail(userId) {
  const fetcher = useFetcher();

  const fetchVerificationDetail = () => {
    const getFuntion = () => {
      return ArcherService.getDetailVerifikasi({ user_id: userId });
    };
    fetcher.runAsync(getFuntion);
  };

  React.useEffect(() => {
    if (!userId) {
      return;
    }
    fetchVerificationDetail();
  }, [userId]);

  return { ...fetcher, fetchVerificationDetail };
}

export { useVerificationDetail };

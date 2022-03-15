import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { Certificate } from "services";

function useUserCertificates() {
  const certificatesFetcher = useFetcher();

  React.useEffect(() => {
    certificatesFetcher.runAsync(() => Certificate.getUserCertificates());
  }, []);

  return certificatesFetcher;
}

export { useUserCertificates };

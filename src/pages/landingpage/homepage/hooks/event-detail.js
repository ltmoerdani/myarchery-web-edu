import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { Landingpage } from "services";

function useEventDetail(slug) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!slug) {
      return;
    }

    const getFunction = () => {
      return Landingpage.getEventBySlug({ slug });
    };

    fetcher.runAsync(getFunction);
  }, [slug]);

  return { ...fetcher };
}

export { useEventDetail };

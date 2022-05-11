import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { Landingpage } from "services";

function useDetailEventBySlug(slug) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!slug) {
      return;
    }

    const getFunction = () => {
      return Landingpage.getDetailEvent({ slug });
    };

    fetcher.runAsync(getFunction);
  }, [slug]);

  return { ...fetcher };
}

export { useDetailEventBySlug };

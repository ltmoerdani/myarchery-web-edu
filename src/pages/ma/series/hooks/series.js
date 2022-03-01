import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";

function useSeries(slug) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!slug) {
      return;
    }
    const getSeriesBySlug = async () => {
      const data = {
        seriesName: "Ini Jakarta Series 2022, Bung!",
      };
      return { success: true, data };
    };
    fetcher.runAsync(getSeriesBySlug);
  }, [slug]);

  return fetcher;
}

export { useSeries };

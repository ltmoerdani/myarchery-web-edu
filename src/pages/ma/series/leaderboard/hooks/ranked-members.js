import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { SeriesService } from "services";

function useRankedMembers(categoryId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!categoryId) {
      return;
    }

    fetcher.runAsync(
      () => {
        return SeriesService.getRankedMembers({ category_serie_id: categoryId });
      },
      { transform: transformData }
    );
  }, [categoryId]);

  return fetcher;
}

function transformData(data) {
  return data.userPoin;
}

export { useRankedMembers };

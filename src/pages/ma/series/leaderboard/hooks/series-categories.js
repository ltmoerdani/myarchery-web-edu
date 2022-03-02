import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { SeriesService } from "services";

function useSeriesCategories(seriesId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!seriesId) {
      return;
    }

    fetcher.runAsync(
      () => {
        return SeriesService.getCategories({ serie_id: seriesId });
      },
      { transform: transformData }
    );
  }, [seriesId]);

  return fetcher;
}

function transformData(data) {
  const categorySeries = {};
  for (const category of data.categorySeries) {
    if (!categorySeries[category.teamCategoryId]) {
      categorySeries[category.teamCategoryId] = [];
    }
    categorySeries[category.teamCategoryId].push(category);
  }
  return { ...data, categorySeries };
}

export { useSeriesCategories };

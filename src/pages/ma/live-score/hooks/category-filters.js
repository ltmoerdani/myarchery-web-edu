import * as React from "react";
import { useCategoriesByGender } from "./event-categories-by-gender";

const teamFilterLabels = {
  "individu male": "Individu Putra",
  "individu female": "Individu Putri",
  maleTeam: "Beregu Putra",
  femaleTeam: "Beregu Putri",
  mixTeam: "Beregu Campuran",
};

function useCategoryFilters(eventId) {
  const { data: categories, groupNames: teamCategories, status } = useCategoriesByGender(eventId);
  const [teamFilterSelected, setTeamFilterSelected] = React.useState(0);
  const [categorySelected, dispatchCategorySelected] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    {}
  );

  const currentTeamFilterName = teamCategories[teamFilterSelected];
  const categoryOptions = _makeCategoryOptions(categories?.[currentTeamFilterName]);
  const teamOptions = teamCategories.map((filterId) => ({
    id: filterId,
    label: teamFilterLabels[filterId],
  }));

  React.useEffect(() => {
    // otomatis set kategori ketika masih null
    if (!categoryOptions?.length || categorySelected[currentTeamFilterName]) {
      return;
    }

    dispatchCategorySelected({ [currentTeamFilterName]: categoryOptions[0] });
  }, [currentTeamFilterName]);

  const isLoading = !categories && status === "loading";
  const isFetching = categories && status === "loading";

  const selectCategory = (category) => {
    dispatchCategorySelected({
      [currentTeamFilterName]: category,
    });
  };
  const activeCategory = categorySelected[currentTeamFilterName];
  const selectTeam = (index) => setTeamFilterSelected(index);
  const activeTeam = { id: currentTeamFilterName, label: teamFilterLabels[currentTeamFilterName] };

  return {
    isLoading,
    isFetching,
    categoryOptions,
    selectCategory,
    activeCategory,
    teamOptions,
    selectTeam,
    activeTeam,
  };
}

function _makeCategoryOptions(data) {
  if (!data) {
    return [];
  }
  return data.map((option) => ({
    id: option.id,
    label: option.categoryLabel,
    type: option.type,
  }));
}

export { useCategoryFilters };

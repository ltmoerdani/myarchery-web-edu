import * as React from "react";

function useCategoriesWithFilters(eventCategories) {
  const [filters, dispatch] = React.useReducer(filtersReducer, {
    competitionCategory: null,
    ageCategories: {},
    categoryDetails: null,
  });

  const { competitionCategory: activeCompetitionCategory, ageCategories } = filters;
  const activeAgeCategory = ageCategories[activeCompetitionCategory];

  React.useEffect(() => {
    if (!eventCategories) {
      return;
    }
    dispatch({ type: "INIT", payload: makeFilteringState(eventCategories) });
  }, [eventCategories]);

  const optionsCompetitionCategory = React.useMemo(() => {
    if (!filters.competitionCategory) {
      return [];
    }
    return Object.keys(filters.categoryDetails).map((competitionCategoryId) => ({
      competitionCategory: competitionCategoryId,
      isActive: competitionCategoryId === filters.competitionCategory,
    }));
  }, [activeCompetitionCategory]);

  const optionsAgeCategory = React.useMemo(() => {
    const selectedCompetitionCategory = filters.competitionCategory;
    const selectedAgeCategory = filters.ageCategories?.[selectedCompetitionCategory];
    if (!selectedAgeCategory || !filters.categoryDetails) {
      return [];
    }
    return Object.keys(filters.categoryDetails[selectedCompetitionCategory]).map(
      (ageCategoryId) => ({
        ageCategory: ageCategoryId,
        isActive: ageCategoryId === selectedAgeCategory,
      })
    );
  }, [activeCompetitionCategory, activeAgeCategory]);

  const selectOptionCompetitionCategory = (competitionCategory) => {
    dispatch({ type: "UPDATE_COMPETITION_CATEGORY", payload: competitionCategory });
  };

  const selectOptionAgeCategory = (ageCategory) => {
    dispatch({ type: "UPDATE_AGE_CATEGORY", payload: ageCategory });
  };

  return {
    activeCompetitionCategory: activeCompetitionCategory,
    activeAgeCategory: activeAgeCategory,
    optionsCompetitionCategory: optionsCompetitionCategory,
    optionsAgeCategory: optionsAgeCategory,
    selectOptionCompetitionCategory,
    selectOptionAgeCategory,
  };
}

function filtersReducer(state, action) {
  if (action.type === "INIT") {
    if (!action.payload) {
      return state;
    }
    return { ...action.payload };
  }

  if (action.type === "UPDATE_COMPETITION_CATEGORY") {
    return { ...state, competitionCategory: action.payload };
  }

  if (action.type === "UPDATE_AGE_CATEGORY") {
    return {
      ...state,
      ageCategories: {
        ...state.ageCategories,
        [state.competitionCategory]: action.payload,
      },
    };
  }

  return state;
}

function makeFilteringState(eventCategories) {
  if (!eventCategories?.length) {
    return;
  }

  const groupedCategories = {};
  for (const categoryDetail of eventCategories) {
    const competitionCategoryId = categoryDetail.competitionCategoryId;
    const classCategory = categoryDetail.classCategory;

    if (!groupedCategories[competitionCategoryId]) {
      groupedCategories[competitionCategoryId] = {};
    }

    if (!groupedCategories[competitionCategoryId][classCategory]) {
      groupedCategories[competitionCategoryId][classCategory] = [];
    }

    groupedCategories[competitionCategoryId][classCategory].push(categoryDetail);
  }

  const competitionCategories = Object.keys(groupedCategories);
  return {
    competitionCategory: competitionCategories[0],
    ageCategories: competitionCategories.reduce((ageCategories, competitionCategory) => {
      ageCategories[competitionCategory] = Object.keys(groupedCategories[competitionCategory])[0];
      return ageCategories;
    }, {}),
    categoryDetails: groupedCategories,
  };
}

export { useCategoriesWithFilters };

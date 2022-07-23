import * as React from "react";

function useMarathonCategoryFilters(eventCategories) {
  const [filters, dispatch] = React.useReducer(_marathonFiltersReducer, {
    competitionCategory: null,
    ageCategories: {},
    categoryDetails: null,
  });

  React.useEffect(() => {
    if (!eventCategories) {
      return;
    }
    dispatch({ type: "INIT", payload: _makeFilterState(eventCategories) });
  }, [eventCategories]);

  const {
    competitionCategory: activeCompetitionCategory,
    ageCategories,
    categoryDetails,
  } = filters;
  const activeAgeCategory = ageCategories[activeCompetitionCategory];
  const activeCategoryDetails =
    categoryDetails?.[activeCompetitionCategory]?.[activeAgeCategory] || [];

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
    activeCompetitionCategory,
    activeAgeCategory,
    activeCategoryDetails,
    optionsCompetitionCategory,
    optionsAgeCategory,
    selectOptionCompetitionCategory,
    selectOptionAgeCategory,
  };
}

function _marathonFiltersReducer(state, action) {
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

function _makeFilterState(categoryDetails) {
  if (!categoryDetails?.length) {
    return;
  }

  const categoryDetailsSortedByID = categoryDetails.sort((first, then) => first.id - then.id);
  const groupedCategories = {};

  for (const categoryDetail of categoryDetailsSortedByID) {
    if (!categoryDetail.isShow || !categoryDetail.quota) {
      continue;
    }

    const competitionCategoryId = categoryDetail.competitionCategoryId;
    const classCategory = categoryDetail.classCategory;

    if (!groupedCategories[competitionCategoryId]) {
      groupedCategories[competitionCategoryId] = {};
    }
    if (!groupedCategories[competitionCategoryId][classCategory]) {
      groupedCategories[competitionCategoryId][classCategory] = [];
    }

    const categoryData = {
      originalCategoryDetail: categoryDetail,
      categoryDetailId: categoryDetail.id,
      teamCategoryLabel: _getTeamLabelFromCategoryLabel(categoryDetail.labelCategory),
      quota: categoryDetail.quota,
      totalParticipant: categoryDetail.totalParticipant,
      remainingQuota: categoryDetail.quota - categoryDetail.totalParticipant,
    };

    groupedCategories[competitionCategoryId][classCategory].push(categoryData);
  }

  const competitionCategories = Object.keys(groupedCategories);
  const defaultCompetitionCategory = competitionCategories[0];
  const defaultAgeCategories = {};

  for (const competitionCategory of competitionCategories) {
    const categoryDetailsByAgeCategory = groupedCategories[competitionCategory];
    const ageCategories = Object.keys(categoryDetailsByAgeCategory);
    defaultAgeCategories[competitionCategory] = ageCategories[0];
  }

  return {
    competitionCategory: defaultCompetitionCategory,
    ageCategories: defaultAgeCategories,
    categoryDetails: groupedCategories,
  };
}

/* ================================ */
// utils
function _getTeamLabelFromCategoryLabel(labelCategoryDetail) {
  const fragments = labelCategoryDetail.split(" - ");
  const lastIndex = fragments.length - 1;
  return fragments[lastIndex].split(" ")[0];
}

export { useMarathonCategoryFilters };

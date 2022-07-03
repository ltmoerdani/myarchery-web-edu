import * as React from "react";

// TODO:
// import { makeCategoryOptions } from "./utils";

function useCategoryFilters(categories) {
  const [filters, dispatch] = React.useReducer(filterReducer, {
    category: null,
    teams: null,
    categoryDetails: null,
  });
  console.log(filters);

  const { activeCategory, activeTeam, activeCategoryDetail } = _getActiveData(filters);

  const categoryOptions = React.useMemo(
    () => _makeCategoryOptions(filters.categoryDetails),
    [filters.categoryDetails]
  );

  const teamOptions = React.useMemo(
    () => _makeTeamOptions(filters.categoryDetails, activeCategory, activeTeam),
    [filters.categoryDetails, activeCategory, activeTeam]
  );

  // Set kategori default sesaat setelah loading
  // Harus jalan cuma sekali di awal ketika belum ada data defaultnya aja
  React.useEffect(() => {
    const groups = (categories && Object.keys(categories)) || [];
    if (!groups?.length) {
      return;
    }
    dispatch({ type: "INIT", payload: categories });
  }, [categories]);

  React.useEffect(() => {
    if (!activeCategory) {
      return;
    }
    window.scrollTo(0, 0);
  }, [activeCategory]);

  const selectCategory = (category) => {
    dispatch({ type: "SELECT_CATEGORY", payload: category });
  };

  const selectTeam = (team) => {
    dispatch({ type: "SELECT_TEAM", payload: team });
  };

  return {
    categoryOptions,
    selectCategory,
    activeCategory,
    teamOptions,
    selectTeam,
    activeTeam,
    activeCategoryDetail,
  };
}

function filterReducer(state, action) {
  if (action.type === "INIT") {
    return _makeInitialState(state, action.payload);
  }

  if (action.type === "SELECT_CATEGORY") {
    return {
      ...state,
      category: action.payload,
    };
  }

  if (action.type === "SELECT_TEAM") {
    return {
      ...state,
      teams: {
        ...state.teams,
        [state.category]: action.payload,
      },
    };
  }

  return state;
}

function _makeInitialState(state, payload) {
  const groupedCategories = _runGrouping(payload);
  const categories = Object.keys(groupedCategories);
  const defaultCategory = state.category || categories[0];
  const defaultTeam = state.teams || _makeDefaultTeamState(groupedCategories, categories);

  return {
    category: defaultCategory,
    teams: defaultTeam,
    categoryDetails: groupedCategories,
  };
}

function _runGrouping(payload) {
  const groupedCategories = {};
  for (const teamGroupName in payload) {
    const categories = payload[teamGroupName];
    for (const category of categories) {
      const labelCategory = _makeCategoryLabel(category);
      if (!groupedCategories[labelCategory]) {
        groupedCategories[labelCategory] = {};
      }
      const categoryDetail = { ...category, labelCategory };
      groupedCategories[labelCategory][teamGroupName] = categoryDetail;
    }
  }
  return groupedCategories;
}

function _makeCategoryLabel(category) {
  const label = [
    category.competitionDetail.label,
    category.ageDetail.label,
    category.distanceDetail.label,
  ].join(" - ");
  return label;
}

function _makeDefaultTeamState(groupedCategories, categories) {
  const teamState = {};
  for (const category of categories) {
    teamState[category] = Object.keys(groupedCategories[category])[0];
  }
  return teamState;
}

function _getActiveData(filters) {
  const { category: activeCategory, teams, categoryDetails } = filters;
  const activeTeam = teams?.[activeCategory];
  const activeCategoryDetail = categoryDetails?.[activeCategory]?.[activeTeam] || null;
  return {
    activeCategory,
    activeTeam,
    activeCategoryDetail,
  };
}

function _makeCategoryOptions(data) {
  if (!data) {
    return [];
  }
  const labels = Object.keys(data);
  if (!labels?.length) {
    return [];
  }
  return labels;
}

function _makeTeamOptions(categoryDetails, activeCategory) {
  if (!categoryDetails || !activeCategory) {
    return [];
  }
  const teamFilterLabels = {
    "individu male": "Individu Putra",
    "individu female": "Individu Putri",
    male_team: "Beregu Putra",
    female_team: "Beregu Putri",
    mix_team: "Beregu Campuran",
  };
  const teams = categoryDetails[activeCategory];
  return Object.keys(teams).map((team) => ({
    id: team,
    label: teamFilterLabels[team],
  }));
}

export { useCategoryFilters };

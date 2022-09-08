import * as React from "react";
import teamCategories from "constants/team-categories";

const { TEAM_LABELS, TEAM_IDS_IN_FIXED_ORDER } = teamCategories;

const FiltersContext = React.createContext();

function useFilters() {
  const value = React.useContext(FiltersContext);
  if (!value) {
    throw new Error("Hook `useFilter` harus dipakai pada children komponen `FilterProvider`");
  }
  return value;
}

function FilterProvider({ children, categories, onChange }) {
  const { categoryDetails, optionsTab, optionsByTabId, initialState } = React.useMemo(() => {
    const categoryDetails = _makeStructuredCategoryDetails(categories);
    const optionsTab = _makeOptionsTab(categoryDetails);
    const optionsByTabId = _makeOptions(categoryDetails);
    const initialState = _makeInitialState(categoryDetails);
    return { categoryDetails, optionsTab, optionsByTabId, initialState };
  }, [categories]);

  const [state, dispatch] = React.useReducer((state, action) => {
    if (action.type === "CHANGE_TAB_ID") {
      return { ...state, tabId: action.payload };
    }

    if (action.type === "CHANGE_KNOB_BY_TYPE") {
      return {
        ...state,
        knobIds: {
          ...state.knobIds,
          [state.tabId]: {
            ...state.knobIds[state.tabId],
            [action.payload.type]: action.payload.knobId,
          },
        },
      };
    }

    if (action.type === "CHANGE_KNOB_CLASS") {
      const optionsTeamCategory = optionsByTabId[state.tabId].teamCategory;
      return {
        ...state,
        knobIds: {
          ...state.knobIds,
          [state.tabId]: {
            classCategory: action.payload,
            teamCategory: _getRelatedTeamCategory(state, action.payload, optionsTeamCategory),
          },
        },
      };
    }

    return state;
  }, initialState);

  React.useEffect(() => {
    onChange?.(_getActiveStates(state, categoryDetails));
  }, [onChange, state, categoryDetails]);

  const setTabId = (tabId) => {
    dispatch({ type: "CHANGE_TAB_ID", payload: tabId });
  };

  const setKnobIds = (type, knobId) => {
    dispatch({ type: "CHANGE_KNOB_BY_TYPE", payload: { type, knobId } });
  };

  const setClassCategory = (classId) => {
    dispatch({ type: "CHANGE_KNOB_CLASS", payload: classId });
  };

  const setTeamCategory = (teamId) => {
    dispatch({
      type: "CHANGE_KNOB_BY_TYPE",
      payload: {
        type: "teamCategory",
        knobId: teamId,
      },
    });
  };

  const activeStates = _getActiveStates(state, categoryDetails);
  const { tabId, knobIds } = state;

  const getKnobOptionsByType = (type) => optionsByTabId[tabId]?.[type];
  const getKnobIdByType = (type) => knobIds[tabId]?.[type];

  const setKnobIdByType = (type, option) => {
    setKnobIds(type, option);
  };

  return (
    <FiltersContext.Provider
      value={{
        categories,
        categoryDetails,
        optionsTab,
        tabId,
        setTabId,
        getKnobOptionsByType,
        getKnobIdByType,
        setKnobIdByType,
        setClassCategory,
        setTeamCategory,
        ...activeStates,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

/* ====================================== */
// utils

function _makeStructuredCategoryDetails(eventCategories) {
  if (!eventCategories?.length) {
    return null;
  }

  const categoryDetailsSortedByID = eventCategories.sort((first, then) => first.id - then.id);
  const structuredCategories = {};

  for (const categoryDetail of categoryDetailsSortedByID) {
    if (!categoryDetail.isShow) {
      continue;
    }

    const competitionCategoryId = categoryDetail.competitionCategoryId;
    const classCategory = categoryDetail.classCategory;
    const genderCategories = categoryDetail.teamCategoryId;

    if (!structuredCategories[competitionCategoryId]) {
      structuredCategories[competitionCategoryId] = {};
    }
    if (!structuredCategories[competitionCategoryId][classCategory]) {
      structuredCategories[competitionCategoryId][classCategory] = {};
    }
    if (!structuredCategories[competitionCategoryId][classCategory][genderCategories]) {
      structuredCategories[competitionCategoryId][classCategory][genderCategories] = [];
    }

    const categoryData = {
      ...categoryDetail,
      teamCategoryLabel: _getTeamLabel(categoryDetail.teamCategoryId),
    };

    structuredCategories[competitionCategoryId][classCategory][genderCategories] = categoryData;
  }

  return structuredCategories;
}

function _getTeamLabel(teamCategoryId) {
  return TEAM_LABELS[teamCategoryId];
}

function _makeOptionsTab(categoryDetails) {
  const competitionCategories = categoryDetails ? Object.keys(categoryDetails) : [];
  return competitionCategories.map((competitionCategory) => ({
    value: competitionCategory,
    label: competitionCategory,
  }));
}

function _makeOptions(categoryDetails) {
  if (!categoryDetails) {
    return null;
  }
  const options = {};
  for (const tabId in categoryDetails) {
    const optionsClassCategory = Object.keys(categoryDetails[tabId]).map((classCategoryId) => ({
      value: classCategoryId,
      label: classCategoryId,
    }));
    const optionsTeamCategory = _makeOptionsTeamCategory(categoryDetails[tabId]);
    options[tabId] = {
      classCategory: optionsClassCategory,
      teamCategory: optionsTeamCategory,
    };
  }
  return options;
}

function _makeOptionsTeamCategory(currentTabDetails) {
  const mergedOptions = {};
  for (const classId in currentTabDetails) {
    for (const teamId in currentTabDetails[classId]) {
      const currentCategoryDetail = currentTabDetails[classId][teamId];
      const parentClassCategory = currentCategoryDetail.classCategory;
      if (!mergedOptions[teamId]) {
        mergedOptions[teamId] = {
          value: teamId,
          label: currentCategoryDetail.teamCategoryLabel,
          relatedClasses: [],
        };
      }
      mergedOptions[teamId].relatedClasses.push(parentClassCategory);
    }
  }
  const sortedTeamIds = TEAM_IDS_IN_FIXED_ORDER.filter((teamId) => Boolean(mergedOptions[teamId]));
  return sortedTeamIds.map((teamId) => mergedOptions[teamId]);
}

function _makeInitialState(categoryDetails) {
  const tabId = categoryDetails ? Object.keys(categoryDetails)[0] : null;
  const knobIds = {};
  for (const tabId in categoryDetails) {
    const classCategory = Object.keys(categoryDetails[tabId])[0] || null;
    const teamCategory = Object.keys(categoryDetails[tabId][classCategory])[0] || null;
    knobIds[tabId] = { classCategory, teamCategory };
  }
  return { tabId, knobIds };
}

function _getRelatedTeamCategory(state, classCategory, optionsTeam) {
  const { teamCategory } = state.knobIds[state.tabId];
  const teamKnobOption = optionsTeam.find((option) => option.value === teamCategory);
  const hasRelatedClass = _checkHasRelatedClassCategory(teamKnobOption, classCategory);

  if (hasRelatedClass) {
    return teamCategory;
  }

  const defaultTeamOption = optionsTeam.find((option) =>
    _checkHasRelatedClassCategory(option, classCategory)
  );
  return defaultTeamOption.value;
}

function _checkHasRelatedClassCategory(option, value) {
  return option?.relatedClasses.some((classCategory) => classCategory === value);
}

function _getActiveStates(state, categoryDetails) {
  const { tabId, knobIds } = state;
  const competitionCategoryId = tabId;
  const classCategoryId = knobIds?.[tabId]?.classCategory || null;
  const teamCategoryId = knobIds?.[tabId]?.teamCategory || null;
  const categoryDetail = categoryDetails?.[tabId]?.[classCategoryId]?.[teamCategoryId] || null;

  return { competitionCategoryId, classCategoryId, teamCategoryId, categoryDetail };
}

export { useFilters, FilterProvider };

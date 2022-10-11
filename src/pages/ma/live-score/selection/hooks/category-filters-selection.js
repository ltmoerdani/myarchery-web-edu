import * as React from "react";
import { useCategoryDetails } from "./category-details";

import teamCategories from "constants/team-categories";

const { TEAM_LABELS } = teamCategories;

function useCategoryFiltersSelection(eventId) {
  const { data: categories } = useCategoryDetails(eventId);

  const { categoryDetails, optionCategories, optionGenders } = React.useMemo(() => {
    const categoryDetails = _makeStructuredCategoryDetails(categories);
    return {
      categoryDetails: categoryDetails,
      optionCategories: _makeOptionCategories(categoryDetails),
      optionGenders: _makeOptionGenders(),
    };
  }, [categories]);

  const getCategoryDetail = ({ competitionCategory, classCategory, teamCategory }) => {
    if (!categoryDetails || !competitionCategory || !classCategory || !teamCategory) {
      return null;
    }
    return categoryDetails[competitionCategory][classCategory][teamCategory];
  };

  return {
    optionCategories,
    optionGenders,
    getCategoryDetail,
  };
}

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

function _makeOptionCategories(categoryDetails) {
  if (!categoryDetails) {
    return [];
  }

  const values = {};
  for (const competitionCategory in categoryDetails) {
    for (const classCategory in categoryDetails[competitionCategory]) {
      const label = `${competitionCategory} - ${classCategory}`;
      values[label] = {
        competitionCategory: competitionCategory,
        classCategory: classCategory,
      };
    }
  }

  const options = Object.keys(values).map((label) => ({
    label: label,
    value: values[label],
  }));

  return options;
}

function _makeOptionGenders() {
  return [
    { value: "individu male", label: "Individu Putra" },
    { value: "individu female", label: "Individu Putri" },
  ];
}

export { useCategoryFiltersSelection };

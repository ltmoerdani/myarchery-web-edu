import React from "react";

const useCategorySelect = (eventCategories, selectCategoryTab) => {
  const [
    competitionCategoryTypeMenuAvailable,
    setCompetitionCategoryTypeMenuAvailable,
  ] = React.useState(null);
  const [teamCategoriesTypeAvailable, setTeamCategoriesTypeAvailable] =
    React.useState(null);
  React.useEffect(() => {
    const competitionCategoryTypeMenu = [];
    const teamCategoriesType = [];
    const barebowAvailable =
      Boolean(eventCategories?.barebowCategory?.individual?.length) ||
      Boolean(eventCategories?.barebowCategory?.team?.length) ||
      Boolean(eventCategories?.barebowCategory?.mix?.length);
    const compoundAvailable =
      Boolean(eventCategories?.compoundCategory?.individual?.length) ||
      Boolean(eventCategories?.compoundCategory?.team?.length) ||
      Boolean(eventCategories?.compoundCategory?.mix?.length);
    const nationalAvailable =
      Boolean(eventCategories?.nationalCategory?.individual?.length) ||
      Boolean(eventCategories?.nationalCategory?.team?.length) ||
      Boolean(eventCategories?.nationalCategory?.mix?.length);
    const recurveAvailable =
      Boolean(eventCategories?.recurveCategory?.individual?.length) ||
      Boolean(eventCategories?.recurveCategory?.team?.length) ||
      Boolean(eventCategories?.recurveCategory?.mix?.length);
    const traditionalBowAvailable =
      Boolean(eventCategories?.traditionalBowCategory?.individual?.length) ||
      Boolean(eventCategories?.traditionalBowCategory?.team?.length) ||
      Boolean(eventCategories?.traditionalBowCategory?.mix?.length);
    if (recurveAvailable) {
      competitionCategoryTypeMenu.push({
        value: "recurveCategory",
        label: "Recurve",
      });
      if (selectCategoryTab === "recurveCategory") {
        teamCategoriesType.splice(0, teamCategoriesType?.length);
        if (eventCategories?.recurveCategory?.individual?.length) {
          teamCategoriesType.push({ value: "individual", label: "Individu" });
        }
        if (eventCategories?.recurveCategory?.team?.length) {
          teamCategoriesType.push({ value: "team", label: "Beregu" });
        }
        if (eventCategories?.recurveCategory?.mix?.length) {
          teamCategoriesType.push({ value: "mix", label: "Campuran" });
        }
      }
    }
    if (compoundAvailable) {
      competitionCategoryTypeMenu.push({
        value: "compoundCategory",
        label: "Compound",
      });
      if (selectCategoryTab === "compoundCategory") {
        teamCategoriesType.splice(0, teamCategoriesType?.length);
        if (eventCategories?.compoundCategory?.individual?.length) {
          teamCategoriesType.push({ value: "individual", label: "Individu" });
        }
        if (eventCategories?.compoundCategory?.team?.length) {
          teamCategoriesType.push({ value: "team", label: "Beregu" });
        }
        if (eventCategories?.compoundCategory?.mix?.length) {
          teamCategoriesType.push({ value: "mix", label: "Campuran" });
        }
      }
    }
    if (nationalAvailable) {
      competitionCategoryTypeMenu.push({
        value: "nationalCategory",
        label: "National",
      });
      if (selectCategoryTab === "nationalCategory") {
        teamCategoriesType.splice(0, teamCategoriesType?.length);
        if (eventCategories?.nationalCategory?.individual?.length) {
          teamCategoriesType.push({ value: "individual", label: "Individu" });
        }
        if (eventCategories?.nationalCategory?.team?.length) {
          teamCategoriesType.push({ value: "team", label: "Beregu" });
        }
        if (eventCategories?.nationalCategory?.mix?.length) {
          teamCategoriesType.push({ value: "mix", label: "Campuran" });
        }
      }
    }
    if (barebowAvailable) {
      competitionCategoryTypeMenu.push({
        value: "barebowCategory",
        label: "Barebow",
      });
      if (selectCategoryTab === "barebowCategory") {
        teamCategoriesType.splice(0, teamCategoriesType?.length);
        if (eventCategories?.barebowCategory?.individual?.length) {
          teamCategoriesType.push({ value: "individual", label: "Individu" });
        }
        if (eventCategories?.barebowCategory?.team?.length) {
          teamCategoriesType.push({ value: "team", label: "Beregu" });
        }
        if (eventCategories?.barebowCategory?.mix?.length) {
          teamCategoriesType.push({ value: "mix", label: "Campuran" });
        }
      }
    }
    if (traditionalBowAvailable) {
      competitionCategoryTypeMenu.push({
        value: "traditionalBowCategory",
        label: "Traditional Bow",
      });
      if (selectCategoryTab === "traditionalBowCategory") {
        teamCategoriesType.splice(0, teamCategoriesType?.length);
        if (eventCategories?.traditionalBowCategory?.individual?.length) {
          teamCategoriesType.push({ value: "individual", label: "Individu" });
        }
        if (eventCategories?.traditionalBowCategory?.team?.length) {
          teamCategoriesType.push({ value: "team", label: "Beregu" });
        }
        if (eventCategories?.traditionalBowCategory?.mix?.length) {
          teamCategoriesType.push({ value: "mix", label: "Campuran" });
        }
      }
    }
    setCompetitionCategoryTypeMenuAvailable(competitionCategoryTypeMenu);
    setTeamCategoriesTypeAvailable(teamCategoriesType);
  }, [eventCategories, selectCategoryTab]);

  return [competitionCategoryTypeMenuAvailable, teamCategoriesTypeAvailable];
};

export { useCategorySelect };

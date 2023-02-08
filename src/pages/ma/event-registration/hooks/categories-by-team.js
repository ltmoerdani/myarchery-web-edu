import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { EventsService } from "services";

function useCategoriesByTeam(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    const getFunction = () => {
      return EventsService.getCategory({ event_id: eventId });
    };
    fetcher.runAsync(getFunction, { transform: _checkDataContainingMarathon });
  }, [eventId]);

  return { ...fetcher };
}

function _checkDataContainingMarathon(data) {
  // Assign flag `isMarathon` ke masing-masing item kategori detail-nya
  const categoriesWithMarathonFlag = { ...data };
  // Membuat kategori by competition category and category type
  const recurveCategory = { individual: [], team: [], mix: [] };
  const compoundCategory = { individual: [], team: [], mix: [] };
  const nationalCategory = { individual: [], team: [], mix: [] };
  const barebowCategory = { individual: [], team: [], mix: [] };
  const traditionalBowCategory = { individual: [], team: [], mix: [] };
  const competitionCategories = {
    recurveCategory,
    compoundCategory,
    nationalCategory,
    barebowCategory,
    traditionalBowCategory,
  };
  const recurveIndividuTemp = [],
    recurveTeamTemp = [],
    recurveMixTemp = [],
    compoundIndividuTemp = [],
    compoundTeamTemp = [],
    compoundMixTemp = [],
    nationalIndividuTemp = [],
    nationalTeamTemp = [],
    nationalMixTemp = [],
    barebowIndividuTemp = [],
    barebowTeamTemp = [],
    barebowMixTemp = [],
    traditionalBowIndividuTemp = [],
    traditionalBowTeamTemp = [],
    traditionalBowMixTemp = [];
  const competitionCategoryType = [
    "Recurve",
    "Compound",
    "Nasional",
    "Barebow",
    "Traditional Bow",
  ];
  for (const teamCategory in data) {
    data[teamCategory].map((category) => {
      if (category.competitionCategoryId === competitionCategoryType[0]) {
        if (
          category.categoryTeam === "Individual" &&
          category.type === "Individual" &&
          category.teamCategoryId.includes("individu")
        ) {
          recurveIndividuTemp.push(category);
          recurveCategory.individual = recurveIndividuTemp;
        } else if (
          (category.categoryTeam === "Team" &&
            category.type === "Team" &&
            category.teamCategoryId === "female_team") ||
          category.teamCategoryId === "male_team"
        ) {
          recurveTeamTemp.push(category);
          recurveCategory.team = recurveTeamTemp;
        } else if (
          category.teamCategoryId === "mix_team" &&
          category.genderCategory === "mix" &&
          category.teamCategoryDetail.id === "mix_team"
        ) {
          recurveMixTemp.push(category);
          recurveCategory.mix = recurveMixTemp;
        }
      } else if (
        category.competitionCategoryId === competitionCategoryType[1]
      ) {
        if (
          category.categoryTeam === "Individual" &&
          category.type === "Individual" &&
          category.teamCategoryId.includes("individu")
        ) {
          compoundIndividuTemp.push(category);
          compoundCategory.individual = compoundIndividuTemp;
        } else if (
          (category.categoryTeam === "Team" &&
            category.type === "Team" &&
            category.teamCategoryId === "female_team") ||
          category.teamCategoryId === "male_team"
        ) {
          compoundTeamTemp.push(category);
          compoundCategory.team = compoundTeamTemp;
        } else if (
          category.teamCategoryId === "mix_team" &&
          category.genderCategory === "mix" &&
          category.teamCategoryDetail.id === "mix_team"
        ) {
          compoundMixTemp.push(category);
          compoundCategory.mix = compoundMixTemp;
        }
      } else if (
        category.competitionCategoryId === competitionCategoryType[2]
      ) {
        if (
          category.categoryTeam === "Individual" &&
          category.type === "Individual" &&
          category.teamCategoryId.includes("individu")
        ) {
          nationalIndividuTemp.push(category);
          nationalCategory.individual = nationalIndividuTemp;
        } else if (
          (category.categoryTeam === "Team" &&
            category.type === "Team" &&
            category.teamCategoryId === "female_team") ||
          category.teamCategoryId === "male_team"
        ) {
          nationalTeamTemp.push(category);
          nationalCategory.team = nationalTeamTemp;
        } else if (
          category.teamCategoryId === "mix_team" &&
          category.genderCategory === "mix" &&
          category.teamCategoryDetail.id === "mix_team"
        ) {
          nationalMixTemp.push(category);
          nationalCategory.mix = nationalMixTemp;
        }
      } else if (
        category.competitionCategoryId === competitionCategoryType[3]
      ) {
        if (
          category.categoryTeam === "Individual" &&
          category.type === "Individual" &&
          category.teamCategoryId.includes("individu")
        ) {
          barebowIndividuTemp.push(category);
          barebowCategory.individual = barebowIndividuTemp;
        } else if (
          (category.categoryTeam === "Team" &&
            category.type === "Team" &&
            category.teamCategoryId === "female_team") ||
          category.teamCategoryId === "male_team"
        ) {
          barebowTeamTemp.push(category);
          barebowCategory.team = barebowTeamTemp;
        } else if (
          category.teamCategoryId === "mix_team" &&
          category.genderCategory === "mix" &&
          category.teamCategoryDetail.id === "mix_team"
        ) {
          barebowMixTemp.push(category);
          barebowCategory.mix = barebowMixTemp;
        }
      } else if (
        category.competitionCategoryId === competitionCategoryType[4]
      ) {
        if (
          category.categoryTeam === "Individual" &&
          category.type === "Individual" &&
          category.teamCategoryId.includes("individu")
        ) {
          traditionalBowIndividuTemp.push(category);
          traditionalBowCategory.individual = traditionalBowIndividuTemp;
        } else if (
          (category.categoryTeam === "Team" &&
            category.type === "Team" &&
            category.teamCategoryId === "female_team") ||
          category.teamCategoryId === "male_team"
        ) {
          traditionalBowTeamTemp.push(category);
          traditionalBowCategory.team = traditionalBowTeamTemp;
        } else if (
          category.teamCategoryId === "mix_team" &&
          category.genderCategory === "mix" &&
          category.teamCategoryDetail.id === "mix_team"
        ) {
          traditionalBowMixTemp.push(category);
          traditionalBowCategory.mix = traditionalBowMixTemp;
        }
      }
    });
    categoriesWithMarathonFlag[teamCategory] = data[teamCategory].map(
      (category) => ({
        ...category,
        isMarathon: Boolean(category.isMarathon),
      })
    );
  }
  // return categoriesWithMarathonFlag;
  return competitionCategories;
}

export { useCategoriesByTeam };

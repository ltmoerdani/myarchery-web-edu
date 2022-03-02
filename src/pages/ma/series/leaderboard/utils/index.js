function makeCategoryOptions(data, teamCategorySelected) {
  if (!data) {
    return [];
  }

  return data[teamCategorySelected.value].map((category) => {
    const label = [
      category.competitionDetail.label,
      category.ageDetail.label,
      category.distanceDetail.label,
    ].join(" - ");
    return { value: category.id, label };
  });
}

export { makeCategoryOptions };

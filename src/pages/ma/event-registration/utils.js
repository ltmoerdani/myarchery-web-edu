function checkIsIndividu(category) {
  const matchesTeamCategoryId = (id) => id === category?.teamCategoryId;
  const isCategoryIndividu = ["individu male", "individu female", "individu_mix"].some(
    matchesTeamCategoryId
  );
  return isCategoryIndividu;
}

export { checkIsIndividu };

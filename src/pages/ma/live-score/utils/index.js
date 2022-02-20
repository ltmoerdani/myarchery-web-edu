function makeCategoryOptions(data) {
  if (!data) {
    return [];
  }
  return data.map((option) => ({ id: option.id, label: option.categoryLabel }));
}

function getLandingPagePath(url) {
  if (!url) {
    return "#";
  }
  const segments = url.split("/");
  const segmentLength = segments.length;
  const path = `/${segments[segmentLength - 3]}/${segments[segmentLength - 2]}/${
    segments[segmentLength - 1]
  }`;
  return path;
}

function getTabNameFromKey(filterKeyName) {
  const label = {
    "individu male": "Individu Putra",
    "individu female": "Individu Putri",
    maleTeam: "Beregu Putra",
    femaleTeam: "Beregu Putri",
    mixTeam: "Beregu Campuran",
  };
  return label[filterKeyName];
}

export { makeCategoryOptions, getLandingPagePath, getTabNameFromKey };

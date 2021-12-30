const RESOURCES_TOTAL = 11;
const RESOURCES_LIMIT = 3;
const DELAY_TIME = 900;

let lastId = 0;
let remainingResources = RESOURCES_TOTAL;

const makeMockClubsData = (qs) => {
  if (qs) {
    const data = new Array(2).fill().map(() => {
      lastId = lastId + 1;
      return {
        id: lastId,
        name: `Debugging - ${lastId}`,
        address: "Debugging Street",
        city: "Debugging City",
      };
    });

    lastId = 0;
    remainingResources = RESOURCES_TOTAL;

    return data;
  } else {
    const generatedCounts =
      remainingResources < RESOURCES_LIMIT ? remainingResources : RESOURCES_LIMIT;

    if (generatedCounts <= 0) {
      return [];
    }
    const data = new Array(generatedCounts).fill().map(() => {
      lastId = lastId + 1;
      return {
        id: lastId,
        name: `Debugging - ${lastId}`,
        address: "Debugging Street",
        city: "Debugging City",
      };
    });
    remainingResources = remainingResources - RESOURCES_LIMIT;
    return data;
  }
};

async function getUserClubs(qs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        lastId === 0 || Math.random() < 0.5
          ? {
              success: true,
              errors: null,
              data: makeMockClubsData(qs),
            }
          : {
              errors: {},
              data: null,
              message: "somehting bad happens...",
            }
      );
    }, DELAY_TIME);
  });
}

const MockClubService = { getUserClubs };

export { MockClubService };

import API from "../utils/api";

export default {
  getCategories(qs = null) {
    return API.get("/app/v1/archery-series/get-list-category-series", qs);
  },
  getRankedMembers(qs = null) {
    return API.get("/app/v1/archery-series/get-list-member-series", qs);
  },
};

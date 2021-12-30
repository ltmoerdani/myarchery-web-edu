import API from "../utils/api";

export default {
  get(qs = null) {
    return API.get("/app/v1/archery/archery-club", qs);
  },
  getProfile(qs = null) {
    return API.get("/app/v1/archery/archery-club/profile", qs);
  },
  getUserClubs(qs = null) {
    return API.get("/app/v1/archery/archery-club/my-club", qs);
  },
  create(data = null, qs = null) {
    return API.post("/app/v1/archery/archery-club/", data, qs, true);
  },
  setJoinClub(data = null, qs = null) {
    return API.post("/app/v1/archery/archery-club/join", data, qs, true);
  },
};

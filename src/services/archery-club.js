import API from "../utils/api";

export default {
  get(qs = null) {
    return API.get("/app/v1/archery/archery-club", qs);
  },
  getProfile(qs = null) {
    return API.get("/app/v1/archery/archery-club/profile", qs);
  },
  create(data = null, qs = null) {
    return API.post("/app/v1/archery/archery-club/", data, qs, true);
  },
  edit(data = null, qs = null) {
    return API.put("/app/v1/archery/archery-club/update", data, qs, true);
  },
  getClubsByUser(qs = null) {
    return API.get("/app/v1/archery/archery-club/my-club", qs);
  },
  getMembersByClub(qs = null) {
    return API.get("/app/v1/archery/archery-club/get-club-member", qs);
  },
  setJoinClub(data = null, qs = null) {
    return API.post("/app/v1/archery/archery-club/join", data, qs, true);
  },
  setLeaveClub(qs = null) {
    return API.deleteByParams("/app/v1/archery/archery-club/left", qs);
  },
  // TODO: provinsi & kota bisa dipindah ke service yang lebih proper
  getProvinces(qs = null) {
    return API.get("/app/v1/archery/archery-club/get-province", qs);
  },
  getCities(qs = null) {
    return API.get("/app/v1/archery/archery-club/get-city", qs);
  },
};

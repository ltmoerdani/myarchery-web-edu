import API from "../utils/api";

export default {
  get(qs = null) {
    return API.get("/app/v1/archery/archery-club", qs);
  },
  create(data = null, qs = null) {
    return API.post("/app/v1/archery/archery-club/", data, qs, true);
  },
  getMyClubs(qs = null) {
    // TODO: ubah endpointnya ke URL yang benar kalau sudah jadi
    return API.get("/app/v1/archery/archery-club", qs);
  },
};

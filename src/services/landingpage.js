import API from "../utils/api";

export default {
  getEvent(qs = null) {
    return API.get("/api/archery-events", qs);
  },
  getEventBySlug(qs = null) {
    return API.get("/general/v2/events/by-slug", qs);
  },
  getDetailEvent(qs = null) {
    return API.get("/web/v1/archery/events/detail-by-slug", qs);
},
};

import API from "../utils/api";

export default {
  register(data = null, qs = null) {
    return API.post("/app/v1/archery/event-order", data, qs, true);
  },
  get(qs = null) {
    return API.get("/app/v1/archery/event-order/1?id=" + qs.id, qs);
  },
  getAll(qs = null) {
    return API.get("/app/v1/archery/event-order", qs);
  },
  getMemberEmails(qs = null) {
    return API.get("/app/v1/archery/event-order/check-email", qs);
  },
  getEventsByAuthUser(qs = null) {
    return API.get("/app/v1/archery-event/my-event", qs);
  },
  setSerieCategory(data = null, qs = null) {
    return API.post("/app/v1/archery-series/join-archery-series", data, qs, true);
  },
  getEventCategoriesByAuthUser(qs = null) {
    return API.get("/app/v1/archery-event/my-category-event", qs);
  },
  registerOfficial(data = null, qs = null) {
    return API.post("/app/v1/archery-event-official/order", data, qs, true);
  },
  getAllOfficial(qs = null) {
    return API.get("/app/v1/archery-event-official/order-official", qs);
  },
  getDetailOfficial(qs = null) {
    return API.get("/app/v1/archery-event-official/event-official-detail", qs);
  },
  getDetailOrderOfficial(qs = null) {
    return API. get("/app/v1/archery-event-official/detail-order", qs);
  },
  listOfficial(qs = null) {
    return API.get("/api/general/list-official", qs);
  },
};

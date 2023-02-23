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
    return API.post(
      "/app/v1/archery-series/join-archery-series",
      data,
      qs,
      true
    );
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
    return API.get("/app/v1/archery-event-official/detail-order", qs);
  },
  listOfficial(qs = null) {
    return API.get("/api/general/list-official", qs);
  },
  checkEmailRegister(data = null) {
    return API.post("/app/v1/archery/users/check-email-is-register", data);
  },
  createOrder(data = null, qs = null) {
    return API.post("/app/v2/archery/event-order", data, qs, true);
  },
  createOrderTeam(data = null, qs = null) {
    return API.post("/app/v1/archery/event-order/team", data, qs, true);
  },

  /**
   * @param {Params} qs { category_id }
   * @returns {Promise} { success, data, errors, message }
   */
  createBooking(qs = null) {
    return API.post(
      "/app/v1/archery/event-order/booking-temporary",
      null,
      qs,
      true
    );
  },

  /**
   * @param {Params} qs { participant_id }
   * @returns {Promise} { success, data, errors, message }
   */
  deleteBooking(qs = null) {
    const reqUrl = "/app/v1/archery/event-order/delete-booking-temporary";
    return API.post(reqUrl, null, qs, true);
  },

  /**
   * Request yang sama dengan `deleteBooking()` yang di atas,
   * tapi dengan config fetch `keepalive=true`. Bisa dipakai di
   * event `beforeunload` (close tab/window, refresh & ganti url)
   *
   * @param {Params} qs { participant_id }
   * @returns {Promise} { success, data, errors, message }
   */
  deleteBookingKeepAlive(qs = null) {
    const reqUrl = "/app/v1/archery/event-order/delete-booking-temporary";
    return API.postKeepAlive(reqUrl, null, qs, true);
  },
};

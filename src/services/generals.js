import API from "../utils/api";

export default {
  getProvinces(qs = null) {
    return API.get("/api/general/get-province", qs);
  },
  getCities(qs = null) {
    return API.get("/api/general/get-city", qs);
  },

  /**
   * @param {Object} qs { limit, page, name }
   * @returns {Promise} { success, data, errors, message }
   */
  getCountries(qs = null) {
    return API.get("/api/general/get-country", qs);
  },

  /**
   * @param {Object} qs { limit, page, name, country_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getCitiesByCountry(qs = null) {
    return API.get("/api/general/get-city-country", qs);
  },

  // V2
  /**
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getEventDetailByIdV2(queryString = null) {
    return API.get("/general/v2/events/by-id", queryString);
  },

  /**
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getCategoryV2(queryString = null) {
    return API.get("/general/v2/category-details", queryString);
  },
  getCategoryNonAuth(querString = null) {
    return API.get("/web/v1/dashboard-dos/category-details", querString);
  },

  /**
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getClubRankingCategories(queryString = null) {
    return API.get("/api/general/get-list-tab-category-by-event-id", queryString);
  },

  getListCategory(queryString = null) {
    return API.get("/general/v2/category-details", queryString);
  },
};

import API from "../utils/api";

export default {
  getListFaq(qs = null) {
    return API.get("/general/v2/q-and-a/get-by-event_id", qs);
  },
};

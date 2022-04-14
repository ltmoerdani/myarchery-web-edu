import API from "../utils/api";

export default {
  getParticipantScoring({ event_category_id }) {
    const qs = { event_category_id };
    return API.get("/api/v1/archery/scorer/qualificaiton", qs);
  },
};

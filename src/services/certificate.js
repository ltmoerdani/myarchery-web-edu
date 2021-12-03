import API from "../utils/api";

export default {
  getByParticipantId(qs = null) {
    return API.get("/app/v1/archery/certificate/list", qs);
  },
  download(qs = null) {
    return API.get("/app/v1/archery/certificate", qs);
  },
};

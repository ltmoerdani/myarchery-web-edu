import API from "../utils/api";

export default {
  getListByEventMember(qs = null) {
    return API.get("/app/v1/certificate/list", qs);
  },
  download(qs = null) {
    return API.get("/app/v1/certificate", qs);
  },
};

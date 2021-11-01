import API from '../utils/api'

export default {
    getEventElimination(qs = null) {
        return API.get("/web/v1/event-elimination/template", qs);
      },
}
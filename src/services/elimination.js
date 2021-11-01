import API from '../utils/api'

export default {
    getEventElimination(qs = null) {
        return API.get("/api/event-elimination/template", qs);
      },
}
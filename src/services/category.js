import API from '../utils/api'

export default {
    get(qs = null) {
        return API.get("/web/v1/archery/event-by-slug", qs)
    },
    getDetailEvent(qs = null) {
        return API.get("/web/v1/archery/events/detail-by-slug", qs)
    },
}
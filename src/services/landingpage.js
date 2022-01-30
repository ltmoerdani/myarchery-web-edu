import API from '../utils/api'

export default {
    getEvent(qs = null) {
        return API.get("/api/archery-events",qs)
    }
}
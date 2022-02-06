import API from '../utils/api'

export default {
    register(data = null, qs = null) {
        return API.post("/web/v1/archery/events", data, qs, true)
    },
    saveScore(data = null, qs = null) {
        return API.post("/web/v1/archery/scorer", data, qs, true)
    },
    get(qs = null) {
        return API.get("/web/v1/archery/events", qs)
    },
    getEventBySlug(qs) {
        return API.get("/web/v1/archery/event-by-slug", qs)
    },
    getEventById(qs) {
        return API.get("/web/v1/archery/events/"+qs.id, qs)
    },
    getEventMember(qs) {
        return API.get("/web/v1/archery/events/participant/members", qs)
    },
    getEventMemberProfile(qs) {
        return API.get("/web/v1/archery/events/participant/member/profile", qs)
    },
    getEventMemberScoring(qs) {
        return API.get("/api/v1/archery/scorer/participant", qs)
    },
    getEventDetailById(qs = null){
        return API.get("/app/v1/archery-event", qs);
    },
    getEventMembersByParticipantId({ participant_id }) {
        return API.get("/app/v1/archery-event/my-category-event-member", { participant_id })
    },
    getDetailEvent(qs = null) {
      return API.get("/web/v1/archery/events/detail-by-slug", qs);
    },
    getCategory(qs = null) {
      return API.get("/web/v1/archery/events/register/list-categories", qs);
    },
}

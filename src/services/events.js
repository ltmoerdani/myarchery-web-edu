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
    updateEventParticipantMembers(data){
        return API.post("/app/v1/archery-event/update-category-event-member", data, null, true);
    },
    getDetailEvent(qs = null) {
        return API.get("/web/v1/archery/events/detail-by-slug", qs);
    },
    getCategory(qs = null) {
        return API.get("/web/v1/archery/events/register/list-categories", qs);
    },
    getEventRanksClubs(qs = null) {
        return API.get("/api/event-ranked/club", qs);
    },
    async addParticipantEntry(payload){
        return await API.post("/app/v1/archery-event/entry-by-name-participant-team", payload, null, true)
    },
    async addMemberKontingenIndividu(payload){
        return await API.post("/api/download-template/member-contingent", payload, null, true)
    },
    async addMemberKontingenTeam(payload){
        return await API.post("/api/download-template/member-contingent-team", payload, null, true)
    }
}

import API from '../utils/api'

export default {
    register(data = null, qs = null) {
        return API.post("/app/v1/auth/register", data, qs)
    },
    login(data = null ,qs = null) {
        return API.post("/app/v1/auth/login", data, qs)
    },
    profile(qs = null) {
        return API.get("/app/v1/user", qs)
    },
    updateProfile(data = null, qs = null) {
        return API.put("/app/v1/user/update-profile", data, qs, true)
    },
    updateAvatar(data = null, qs = null) {
        return API.put("/app/v1/user/update-avatar", data, qs, true)
    },
    forgotPassword(data = null, qs = null) {
        return API.post("/app/v1/auth/forgot-password", data, qs)
    },
    verificationPassword(data = null, qs = null) {
        return API.post("/app/v1/auth/validate-code-password", data, qs)
    },
    resetPassword(data = null, qs = null) {
        return API.post("/app/v1/auth/reset-password", data, qs)
    },
    updateVerifikasi(data = null, qs = null) {
        return API.put("/app/v1/user/update-verifikasi", data, qs, true)
    },
    getDetailVerifikasi(qs = null) {
        return API.get("/app/v1/user/data-verifikasi", qs)
    }
}
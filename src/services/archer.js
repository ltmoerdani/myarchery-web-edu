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
    forgotPassword(data = null, qs = null) {
        return API.post("/app/v1/auth/forgot-password", data, qs)
    },
    verificationPassword(data = null, qs = null) {
        return API.post("/app/v1/auth/validate-code-password", data, qs)
    },
    resetPassword(data = null, qs = null) {
        return API.post("/app/v1/auth/reset-password", data, qs)
    }
}
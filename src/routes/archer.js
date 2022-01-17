import LoginArcher from "../pages/authArcher/login"
import RegisterArcher from "../pages/authArcher/register"
import Logout from "../pages/authArcher/logout"
import ForgotPassword from "pages/authArcher/forgotPassword"

const archerRouters = [
    { path: "/archer/login", component: LoginArcher, exact: true},
    { path: "/archer/register", component: RegisterArcher, exact: true},
    { path: "/archer/logout", component: Logout, exact: true},
    { path: "/archer/forgot-password", component: ForgotPassword, exact: true},
]

export default archerRouters

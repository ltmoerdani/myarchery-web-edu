import LoginArcher from "../pages/authArcher/login"
import RegisterArcher from "../pages/authArcher/register"
import Logout from "../pages/authArcher/logout"
import PolicyArcher from "../pages/authArcher/policy"

const archerRouters = [
    { path: "/archer/login", component: LoginArcher, exact: true},
    { path: "/archer/register", component: RegisterArcher, exact: true},
    { path: "/archer/logout", component: Logout, exact: true},
    { path: "/kebijakan-privasi", component: PolicyArcher, exact: true},
]

export default archerRouters

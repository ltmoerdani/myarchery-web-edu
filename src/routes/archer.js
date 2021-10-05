import LoginArcher from "../pages/authArcher/login";
import RegisterArcher from "../pages/authArcher/register";
import Logout from "../pages/authArcher/logout";

const archerRouters = [
  { path: "/login", component: LoginArcher, exact: true },
  { path: "/register", component: RegisterArcher, exact: true },
  { path: "/logout", component: Logout, exact: true },
];

export default archerRouters;

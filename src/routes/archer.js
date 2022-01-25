import LoginArcher from "../pages/authArcher/login";
import RegisterArcher from "../pages/authArcher/register";
import Logout from "../pages/authArcher/logout";
import ForgotPassword from "pages/authArcher/forgotPassword";
import Verification from "pages/authArcher/verification";
import ResetPasswordArcher from "pages/authArcher/resetPassword";
import ResetSuccessArcher from "pages/authArcher/resetSuccess"

const archerRouters = [
  { path: "/archer/login", component: LoginArcher, exact: true },
  { path: "/archer/register", component: RegisterArcher, exact: true },
  { path: "/archer/logout", component: Logout, exact: true },
  { path: "/archer/forgot-password", component: ForgotPassword, exact: true },
  { path: "/archer/verification/:email", component: Verification, exact: true },
  { path: "/archer/reset-password/:email", component: ResetPasswordArcher, exact: true },
  { path: "/archer/reset-done/", component: ResetSuccessArcher, exact: true },
];

export default archerRouters;

import Logout from "../pages/authArcher/logout";
import Verification from "pages/authArcher/verification";
import ResetPasswordArcher from "pages/authArcher/resetPassword";
import ResetSuccessArcher from "pages/authArcher/resetSuccess";
import PolicyArcher from "pages/authArcher/policy";

import PageAuthRegister from "pages/ma/auth-register";
import PageAuthRegisterVerification from "pages/ma/auth-register/verification";
import PageAuthLogin from "pages/ma/auth-login";
import PageAuthPasswordReset from "pages/ma/auth-password-reset";

const archerRouters = [
  { path: "/archer/login", component: PageAuthLogin, exact: true },
  { path: "/archer/register", component: PageAuthRegister, exact: true },
  { path: "/archer/register-verification", component: PageAuthRegisterVerification, exact: true },
  { path: "/archer/logout", component: Logout, exact: true },
  { path: "/archer/forgot-password", component: PageAuthPasswordReset, exact: true },
  { path: "/archer/verification/:email", component: Verification, exact: true },
  { path: "/archer/reset-password/:email", component: ResetPasswordArcher, exact: true },
  { path: "/archer/reset-done/", component: ResetSuccessArcher, exact: true },
  { path: "/kebijakan-privasi", component: PolicyArcher, exact: true },
];

export default archerRouters;

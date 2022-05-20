import LandingPage from "../pages/landingpage/homepage";
import DisplayScore from "pages/landingpage/display";
import DisplayEliminasi from "pages/landingpage/eliminasi";
import Stages from "pages/landingpage/stages";

import PageHome from "pages/ma/home";

const landingpageRouters = [
  { path: "/event/:username/:slug", component: LandingPage, exact: true },
  { path: "/display/score/:slug", component: DisplayScore },
  { path: "/display/eliminasi/:slug", component: DisplayEliminasi },
  { path: "/display/stages/:slug", component: Stages },
  { path: "/home", exact: true, component: PageHome },
];

export default landingpageRouters;

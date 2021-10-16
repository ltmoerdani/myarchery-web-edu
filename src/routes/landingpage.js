import LandingPage from "../pages/landingpage/homepage"
import DisplayScore from "pages/landingpage/display";
import Home from "pages/landingpage/home";
import Stages from "../pages/landingpage/stages"
import DisplayEliminasi from "pages/landingpage/eliminasi";

const landingpageRouters = [
    { path: "/event/:username/:slug", component: LandingPage, exact: true },
    { path: "/display/score/:slug", component: DisplayScore},
    { path: "/display/eliminasi", component: DisplayEliminasi},
    { path: "/display/stages", component: Stages},
    { path: "/home", component: Home}

]

export default landingpageRouters
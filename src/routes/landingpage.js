import LandingPage from "../pages/landingpage/homepage"
import DisplayScore from "pages/landingpage/display";

const landingpageRouters = [
    { path: "/event/:username/:slug", component: LandingPage, exact: true },
    { path: "/display/score/:slug", component: DisplayScore},
    { path: "/display/eliminasi/:slug", component: DisplayEliminasi},
    { path: "/display/stages/:slug", component: Stages},
    { path: "/home", component: Home}

]

export default landingpageRouters
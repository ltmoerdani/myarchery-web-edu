import LandingPage from "../pages/landingpage/homepage"
import DisplayScore from "pages/landingpage/display";
import Home from "pages/landingpage/home";

const landingpageRouters = [
    { path: "/event/:username/:slug", component: LandingPage, exact: true },
    { path: "/display/score/:slug", component: DisplayScore},
    { path: "/home", component: Home}

]

export default landingpageRouters
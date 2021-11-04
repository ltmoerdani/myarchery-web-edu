import LandingPage from "../pages/landingpage/homepage"
import DisplayScore from "pages/landingpage/display";
import DisplayEliminasi from "pages/landingpage/eliminasi";
import Stages from "pages/landingpage/stages";
import CertificatesPage from "pages/landingpage/certificate";
import Home from "pages/landingpage/home";

const landingpageRouters = [
    { path: "/event/:username/:slug", component: LandingPage, exact: true },
    { path: "/event/:username/:slug/certificates", component: CertificatesPage},
    { path: "/display/score/:slug", component: DisplayScore},
    { path: "/display/eliminasi/:slug", component: DisplayEliminasi},
    { path: "/display/stages/:slug", component: Stages},
    { path: "/home", component: Home}

]

export default landingpageRouters
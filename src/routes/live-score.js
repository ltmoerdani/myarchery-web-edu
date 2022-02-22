import PageScoreQualification from "pages/ma/live-score";
import PageScoreElimination from "pages/ma/live-score/elimination";

const liveScoreRouters = [
  { path: "/live-score/:slug/qualification", component: PageScoreQualification },
  { path: "/live-score/:slug/elimination", component: PageScoreElimination },
];

export default liveScoreRouters;

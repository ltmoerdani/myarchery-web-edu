import PageScoreQualification from "pages/ma/live-score";
import PageScoreElimination from "pages/ma/live-score/elimination";
import PageScoreSelection from "pages/ma/live-score/selection";

const liveScoreRouters = [
  { path: "/live-score/:slug/qualification", component: PageScoreQualification },
  { path: "/live-score/:slug/elimination", component: PageScoreElimination },
  { path: "/live-score/:slug/selection", component: PageScoreSelection },
];

export default liveScoreRouters;

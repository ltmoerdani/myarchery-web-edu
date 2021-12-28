import PageDashboard from "pages/ma/dashboard";
import PageClubHome from "pages/ma/dashboard/club";
import PageClubCreate from "pages/ma/dashboard/club-create";

const dashboardRoutes = [
  { path: "/dashboard", exact: true, component: PageDashboard },
  { path: "/dashboard/clubs", exact: true, component: PageClubHome },
  { path: "/dashboard/clubs/new", exact: true, component: PageClubCreate },
];

export default dashboardRoutes;

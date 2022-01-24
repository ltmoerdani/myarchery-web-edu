import PageDashboard from "pages/ma/dashboard";
import PageClubHome from "pages/ma/dashboard/club";
import PageClubCreate from "pages/ma/dashboard/club-create";
import PageClubJoin from "pages/ma/dashboard/club-join";
import PageClubManage from "pages/ma/dashboard/club-manage";
import PageTransactionDetail from "pages/ma/dashboard/transaction/detail"

const dashboardRoutes = [
  { path: "/dashboard", exact: true, component: PageDashboard },
  { path: "/dashboard/clubs", exact: true, component: PageClubHome },
  { path: "/dashboard/clubs/new", exact: true, component: PageClubCreate },
  { path: "/dashboard/clubs/join", exact: true, component: PageClubJoin },
  { path: "/dashboard/clubs/detail/:clubId", exact: true, component: PageClubManage },
  { path: "/dashboard/transactions/:orderId", exact: true, component: PageTransactionDetail },
];

export default dashboardRoutes;

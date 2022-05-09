import PageDashboard from "pages/ma/dashboard";
import PageCertificates from "pages/ma/dashboard/certificates";
import PageClubHome from "pages/ma/dashboard/club";
import PageClubCreate from "pages/ma/dashboard/club-create";
import PageClubJoin from "pages/ma/dashboard/club-join";
import PageClubManage from "pages/ma/dashboard/club-manage";
import PageEventsHome from "pages/ma/dashboard/events";
import PageEventCategories from "pages/ma/dashboard/events-categories";
import PageEventCategoryDetail from "pages/ma/dashboard/events-category-detail";
import ListTransactionPage from "pages/ma/dashboard/list-transaction";
import PageTransactionDetail from "pages/ma/dashboard/transaction/detail";
import PageProfileHome from "pages/ma/dashboard/profile";
import PageProfileVerifikasiHome from "pages/ma/dashboard/profil-verifikasi";
import PageTransactionDetailOfficial from "pages/ma/dashboard/transaction/detail/official";

const dashboardRoutes = [
  { path: "/dashboard", exact: true, component: PageDashboard },
  { path: "/dashboard/clubs", exact: true, component: PageClubHome },
  { path: "/dashboard/clubs/new", exact: true, component: PageClubCreate },
  { path: "/dashboard/clubs/join", exact: true, component: PageClubJoin },
  { path: "/dashboard/clubs/detail/:clubId", exact: true, component: PageClubManage },
  { path: "/dashboard/events", exact: true, component: PageEventsHome },
  { path: "/dashboard/events/:event_id", exact: true, component: PageEventCategories },
  {
    path: "/dashboard/events/:event_id/category/:order_id",
    exact: true,
    component: PageEventCategoryDetail,
  },
  { path: "/dashboard/certificates", exact: true, component: PageCertificates },
  { path: "/dashboard/list-transaction", exact: true, component: ListTransactionPage },
  { path: "/dashboard/transactions/:orderId", exact: true, component: PageTransactionDetail },
  { path: "/dashboard/transactions-official/:slug", exact: true, component: PageTransactionDetailOfficial },
  { path: "/dashboard/profile", exact: true, component: PageProfileHome },
  { path: "/dashboard/profile/verifikasi", exact: true, component: PageProfileVerifikasiHome },
];

export default dashboardRoutes;

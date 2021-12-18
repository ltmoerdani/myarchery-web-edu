import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import LatestEventsList from "./components/latest-events";
import DashboardMenus from "./components/menus";

const DashboardWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .dashboard-greeting {
    .heading {
      font-weight: 500;
      color: #000000;
    }
  }
`;

function PageDashboard() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  return (
    <DashboardWrapper>
      <MetaTags>
        <title>Dashboard | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="dashboard-greeting mb-5">
          <h1 className="heading">Halo, {userProfile.name}</h1>
          <p className="subheading">Selamat datang di myarchery.id</p>
        </div>

        <DashboardMenus />

        <h3 className="mt-5 mb-3">Event-Event Terbaru</h3>
        <LatestEventsList />
      </Container>
    </DashboardWrapper>
  );
}

export default PageDashboard;

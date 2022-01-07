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
  font-family: "Inter", sans-serif;

  .heading {
    font-weight: 500;
    color: #000000;
  }
`;

function GreetingUserText({ children }) {
  const text = children ? `Halo, ${children.name}` : "Halo!";
  return <h1 className="heading">{text}</h1>;
}

function PageDashboard() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  return (
    <DashboardWrapper>
      <MetaTags>
        <title>Dashboard | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="mb-5">
          <GreetingUserText>{userProfile}</GreetingUserText>
          <p className="subheading">Selamat datang di myarchery.id</p>
        </div>

        <DashboardMenus />

        <LatestEventsHeader className="mt-5 mb-4">
          <h3 className="events-heading">3 Event Terbaru yang Diikuti</h3>
          <div className="events-description">
            Lihat semua pertandingan yang diikuti di Menu Event Saya
          </div>
        </LatestEventsHeader>
        <LatestEventsList />
      </Container>
    </DashboardWrapper>
  );
}

const LatestEventsHeader = styled.div`
  .events-heading {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .events-description {
    font-size: 0.875rem;
    color: var(--ma-gray-500);
  }
`;

export default PageDashboard;

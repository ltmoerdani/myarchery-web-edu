import React from "react";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { BreadcrumbDashboard } from "../components/breadcrumb";
import { ClubDataListView } from "./components/list-view";

function PageClubHome() {
  const breadcrumpCurrentPageLabel = "Kembali";

  return (
    <ClubPageWrapper>
      <MetaTags>
        <title>Klub Saya | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="/dashboard">{breadcrumpCurrentPageLabel}</BreadcrumbDashboard>

        <ClubDataListView />
      </Container>
    </ClubPageWrapper>
  );
}

const ClubPageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";
`;

export default PageClubHome;

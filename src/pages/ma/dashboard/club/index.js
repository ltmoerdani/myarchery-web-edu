import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { ClubDataListView } from "./components/list-view";

function PageClubHome() {
  const breadcrumpCurrentPageLabel = "Kembali";

  return (
    <ClubPageWrapper>
      <MetaTags>
        <title>Klub Saya | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="dashboard-breadcrumb">
          <Link to="/dashboard">
            <span className="breadcrumb__back-button">&lsaquo;</span>
          </Link>{" "}
          <span>{breadcrumpCurrentPageLabel}</span>
        </div>

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

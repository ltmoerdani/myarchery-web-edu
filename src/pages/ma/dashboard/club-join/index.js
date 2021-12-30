import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { JoinClubDataListView } from "./components/list-view";

const PAGE_TITLE = "Daftar Klub";

function PageClubJoin() {
  const breadcrumbCurrentPageLabel = PAGE_TITLE;

  return (
    <JoinClubPageWrapper>
      <MetaTags>
        <title>{PAGE_TITLE} | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="dashboard-breadcrumb">
          <Link to="/dashboard">
            <span className="breadcrumb__back-button">&lsaquo;</span>
          </Link>{" "}
          <span>{breadcrumbCurrentPageLabel}</span>
        </div>

        <JoinClubDataListView />
      </Container>
    </JoinClubPageWrapper>
  );
}

const JoinClubPageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";
`;

export default PageClubJoin;

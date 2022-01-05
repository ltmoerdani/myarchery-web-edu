import React from "react";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { BreadcrumbDashboard } from "../components/breadcrumb";
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
        <BreadcrumbDashboard to="/dashboard/clubs">
          {breadcrumbCurrentPageLabel}
        </BreadcrumbDashboard>

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

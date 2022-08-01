import * as React from "react";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { ProcessingToast } from "components/ma/processing-toast";
import { Breadcrumb } from "./components/breadcrumb";

function PageWrapper({ children, pageTitle, before, after, breadcrumbText, breadcrumbLink }) {
  return (
    <React.Fragment>
      <MetaTags>
        {pageTitle ? <title>{pageTitle} | MyArchery.id</title> : <title>MyArchery.id</title>}
      </MetaTags>

      {before}

      <StyledPageWrapper>
        <Container fluid>
          <Breadcrumb label={breadcrumbText} to={breadcrumbLink} />

          {children}
        </Container>

        <ProcessingToast />
      </StyledPageWrapper>

      {after}
    </React.Fragment>
  );
}

const StyledPageWrapper = styled.div`
  font-family: "Inter", sans-serif;
  margin: 2.5rem 0 5rem 0;
`;

export { PageWrapper };

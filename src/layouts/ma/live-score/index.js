import * as React from "react";
import styled from "styled-components";

import Header from "./Header";
import Footer from "./Footer.js";

function LayoutLiveScore({ children }) {
  React.useEffect(() => {
    document.body.setAttribute("data-layout", "horizontal");
    window.scrollTo(0, 0);
  }, []);

  return (
    <StyledLayoutWrapper id="layout-wrapper">
      <Header />
      <div className="main-content">{children}</div>
      <Footer />
    </StyledLayoutWrapper>
  );
}

const StyledLayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main-content {
    overflow: visible;
    padding-top: var(--ma-header-height);
  }
`;

export default LayoutLiveScore;

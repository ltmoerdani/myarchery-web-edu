import * as React from "react";
import styled from "styled-components";

import Header from "./Header";
import Footer from "./Footer.js";

const StyledLayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main-content {
    padding-top: var(--ma-header-height);
  }
`;

function LayoutDashboard({ children }) {
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

export default LayoutDashboard;

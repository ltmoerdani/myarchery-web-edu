import * as React from "react";
import styled from "styled-components";

import { Container, Row, Col } from "reactstrap";

function Footer() {
  const copyRightYear = new Date().getFullYear();
  return (
    <StyledFooter className="mt-auto">
      <Container fluid>
        <Row style={{ height: 60 }}>
          <Col className="text-center d-flex align-items-center justify-content-center">
            {copyRightYear} &copy; MyArchery. Designed &amp; Developed by Reka Cipta Digital
          </Col>
        </Row>
      </Container>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  height: 60px;
  background-color: var(--ma-blue-50);
`;

export default Footer;

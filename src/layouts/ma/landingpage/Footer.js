import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Container, Row, Col } from "reactstrap";

import logoLight from "assets/images/myachery/myachery.png";

function Footer() {
  const copyRightYear = new Date().getFullYear();

  return (
    <StyledFooter className="mt-auto">
      <Container fluid>
        <Row>
          <Col>
            <FooterContent>
              <div>
                <Link to="/" className="logo">
                  <img src={logoLight} alt="" height="109" />
                </Link>
              </div>

              <h3 className="myarchery-domain">MyArchery.id</h3>

              <div>
                {copyRightYear} &copy; Designed &amp; Developed by Reka Cipta Digital
                <br />
                Infiniti Office MTH Square GF A4/A
                <br />
                Jl. Letjen M.T. Haryono No. Kav 10, Cawang, Jakarta Timur, 13330
                <br />
                Telepon/WA: +62 812-1224-1633
              </div>
            </FooterContent>
          </Col>
        </Row>
      </Container>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  background-color: var(--ma-blue-50);
  font-family: Inter;
`;

const FooterContent = styled.div`
  margin: 4rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  text-align: center;

  .myarchery-domain {
    font-weight: 600;
    color: var(--ma-blue);
  }
`;

export default Footer;

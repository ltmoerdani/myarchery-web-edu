import * as React from "react";

import { Container, Row, Col } from "reactstrap";
import logo_footer from "../../../assets/images/myachery/logo 4.svg"


function Footer() {
  const copyRightYear = new Date().getFullYear();
  return (
    <React.Fragment>
      <div style={{backgroundColor: '#F6F6F6'}}>
      <Container fluid>
        <Row>
          <Col className="text-center">
            <div className="py-5">
              <div>
                <img src={logo_footer} style={{width: '10%'}} />
              </div>
              <div>
                <h3 style={{color: '#0D47A1'}}>MyArchery.id</h3>
              </div>
              {copyRightYear} © Design & Develop by Reka Cipta Digital<br />
              Infiniti Office MTH Square GF A4/A<br />
              Jl. Letjen M.T. Haryono No.Kav 10,Cawang, Jakarta Timur 13330
            </div>
          </Col>
        </Row>
      </Container>
      </div>
      </React.Fragment>
  );
}

export default Footer;

import React from "react";
import { Row, Col } from "reactstrap";
import styled from "styled-components";

import pro from "../../../../assets/images/partners/pro.png";
import monster from "../../../../assets/images/partners/monster.png";
// import queen from "../../../../assets/images/partners/queen.png"
import victory from "../../../../assets/images/partners/victory.png";

const TitleAds = styled.h3`
  font-weight: 800;
  font-size: 36px;
  color: #0d47a1;
  line-height: 110%;
  text-align: center;
  margin-top: 1rem;
`;

const TextAds = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  color: #545454;
  align-items: center;
  text-align: center;
`;

const MainCardHeader = styled.div`
  align-items: center;
  gap: 1.5rem;
`;

function AdsBanner() {
  return (
    <MainCardHeader>
      <Row>
        <Col md={12}>
          <TitleAds>Partner MyArchery</TitleAds>
        </Col>
      </Row>

      <Row>
        <Col md={{ size: 12 }}>
          <TextAds>
            Bersama berbagai komunitas, klub, organisasi, dan toko perlengkapan
            panah, MyArchery memastikan kegiatan panahan selalu nyaman dan
            menyenangkan untuk berbagai kalangan.
          </TextAds>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <img
            src={pro}
            style={{ paddingTop: 20, float: "right" }}
            alt="Pro Partner"
            className="img-fluid"
          />
        </Col>
        <Col md={4}>
          <img
            src={monster}
            style={{ paddingTop: 30 }}
            alt="Monster Partner"
            className="img-fluid"
          />
        </Col>
        <Col md={4}>
          <img
            src={victory}
            style={{ width: "200px" }}
            alt="Victory Partner"
            className="img-fluid"
          />
        </Col>
      </Row>
    </MainCardHeader>
  );
}

export default AdsBanner;

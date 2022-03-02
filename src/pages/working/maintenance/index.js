import React from "react";
import MetaTags from "react-meta-tags";
import { Container, Row, Col } from "reactstrap";

import maintenance from "../../../assets/images/maintenance.svg";

const Maintenance = () => {
  return (
    <React.Fragment>
      <section className="my-5 pt-sm-5">
        <MetaTags>
          <title>Maintenance | MyArchery</title>
        </MetaTags>
        <Container>
          <Row>
            <Col xs="12" className="text-center">
              <div className="home-wrapper">
                <div className="mb-5">
                  <h1>Pemeliharaan Sistem</h1>
                </div>

                <Row className="justify-content-center">
                  <Col sm={4}>
                    <div className="maintenance-img">
                      <img src={maintenance} alt="" className="img-fluid mx-auto d-block" />
                    </div>
                  </Col>
                </Row>
                <h3 className="mt-5">Kami sedang melakukan peningkatan sistem</h3>
                <p>Silakan kembali beberapa saat lagi</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Maintenance;

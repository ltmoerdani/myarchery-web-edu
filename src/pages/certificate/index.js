import * as React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";

import MetaTags from "react-meta-tags";
import { Container, Card, CardBody, Row, Col, Button } from "reactstrap";
import ProfileMenuArcher from "components/TopbarDropdown/ProfileMenuArcher";
import Footer from "layouts/landingpage/Footer";

import logomyarchery from "assets/images/myachery/myachery.png";
import { ReactComponent as IconCheck } from "assets/icons/check-circle.svg";

const AlertVerifiedStyled = styled.div`
  background-color: #efefef;
  padding: 20px;
`;

function AlertVerified() {
  return (
    <AlertVerifiedStyled className="w-100 d-flex justify-content-center align-items-center rounded-3 mb-4">
      <IconCheck stroke="#368759" className="me-2" />
      <span>Sertifikat Terverifikasi</span>
    </AlertVerifiedStyled>
  );
}

function CardCertificateInfo({ data }) {
  if (!data) {
    return null;
  }

  return (
    <Card className="text-muted">
      <CardBody>
        <Row className="mt-4">
          <Col md="6">
            <h6>Nama Archer</h6>
            <p>Sudjiwo Tejo</p>
          </Col>

          <Col md="6">
            <h6>Nomor ID</h6>
            <p>X-XXX</p>
          </Col>

          <Col md="6">
            <h6>Klub</h6>
            <p>Memanah Club</p>
          </Col>

          <Col md="6">
            <h6>Kategori</h6>
            <p>Umum - Individu - Barebow</p>
          </Col>

          <Col md="6">
            <h6>Peringkat</h6>
            <p>Juara 1</p>
          </Col>
        </Row>

        <hr className="mt-0" />

        <Row className="mt-4">
          <Col md="6">
            <h6>Event</h6>
            <p>The HuB Scoring 2021</p>
          </Col>

          <Col md="6">
            <h6>Tanggal</h6>
            <p>12 Oktober 2021</p>
          </Col>

          <Col md="6">
            <h6>Lokasi</h6>
            <p>The Hub, Bekasi</p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default function CertificateVerificationPage() {
  const { certificate_code } = useParams();
  console.log(certificate_code);
  const path = window.location.pathname;

  const { isLoggedIn } = useSelector(getAuthenticationStore);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Sertifikat Event</title>
      </MetaTags>

      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <div className="px-4 py-1 sticky-top bg-light d-flex justify-content-between">
          <Link to="/archer/dashboard">
            <div>
              <img src={logomyarchery} width="91" />
            </div>
          </Link>

          {isLoggedIn ? (
            <div>
              <ProfileMenuArcher color="black" />
            </div>
          ) : (
            <Link style={{ padding: "20px" }} to={"/archer/login?path=" + path}>
              <Button className="float-end" color="outline-dark">
                Masuk
              </Button>
            </Link>
          )}
        </div>

        <Container className="mt-4 mb-5">
          <AlertVerified />
          <CardCertificateInfo data={null} />
        </Container>

        <div className="mt-auto position-relative" style={{ height: 83 }}>
          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
}

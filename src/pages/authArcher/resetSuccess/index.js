import login_background from "assets/images/myachery/login-background.svg";
import React from "react";
import MetaTags from "react-meta-tags";
import { Link} from "react-router-dom";
import { Col, Row, Container } from "reactstrap";

import passwordDone from "assets/images/myachery/password-done.png"

import "./components/sass/styles.scss";

const ResetSuccessArcher = () => {
  return (
    <React.Fragment>
      <MetaTags>
        <title>Reset Password | MyArchery</title>
      </MetaTags>
      <Container fluid>
        <div className="position-relative">
          <div
            className="position-absolute d-md-block d-none"
            style={{ zIndex: "1", width: "50%", height: "100vh" }}
          >
            <img className="img-circle" src={login_background} />
          </div>
          <div className="circle-blue d-md-block d-none"></div>
          <div className="circle-yellow d-md-block d-none"></div>
          <Row>
            <Col md={5} sm={12} xs={12}></Col>
            <Col md={7} sm={12} xs={12}>
              <div className="mx-auto w-50" style={{ paddingTop: "10vh" }}>
              <div className="w-50 mx-auto">
                <img src={passwordDone} />
              </div>
                <div className="text-center">
                  <h2 style={{ color: "#0D47A1", fontSize: "32px", lineHeight: "38.4px" }}>
                    Selamat kata sandi akun Anda berhasil diubah
                  </h2>
                  <span style={{ fontSize: "20px", lineHeight: "28px" }}>
                    Yuk sekarang coba masuk
                  </span>
                </div>
                <div className="mt-4 d-grid">
                  <Link to="/archer/login">
                    <button
                      className="btn w-100"
                      style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                      type="button"
                    >
                      Masuk
                    </button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default ResetSuccessArcher;

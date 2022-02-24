import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import { AvField, AvForm } from "availity-reactstrap-validation";
import login_background from "assets/images/myachery/login-background.svg";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { ArcherService } from "services";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from "react-router-dom";

import "./components/sass/styles.scss";

function ForgotPassword() {
  const [confirm, setConfirm] = useState(false);
  const [faild, setFaild] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { push } = useHistory();

  const handleGoVerification = () => push(`/archer/verification/${email}`);
  const onFaildClikOk = () => setFaild(false);

  const handleValidSubmit = async (event, values) => {
    setEmail(values.email);
    const { data, message } = await ArcherService.forgotPassword(values);
    if (!data) {
      setMessage(message);
      setFaild(true);
    }
    if (data) {
      setConfirm(true);
    }
  };
  return (
    <React.Fragment>
      <MetaTags>
        <title>Lupa password | MyArchery</title>
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
              <div className="mx-auto w-50" style={{ paddingTop: "25vh" }}>
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: "var(--ma-blue)" }}>
                    Ubah Kata Sandi
                  </h2>
                  <p className="fs-5">
                    Link reset kata sandi akan dikirimkan ke email di bawah ini
                  </p>
                </div>

                <AvForm
                  className="form-horizontal"
                  onValidSubmit={(e, v) => {
                    handleValidSubmit(e, v);
                  }}
                >
                  <div className="mb-3">
                    <AvField
                      name="email"
                      label="Email"
                      className="form-control"
                      placeholder="Masukkan email"
                      type="email"
                      required
                      errorMessage="email belum diisi"
                    />
                  </div>

                  <div className="mt-3 d-grid">
                    <button
                      className="btn"
                      style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                      type="submit"
                    >
                      Kirim
                    </button>
                  </div>

                  <div className="mt-5 text-center">
                    <p>
                      Batal ubah?{" "}
                      <Link to="/archer/login" className="fw-medium text-primary">
                        Masuk di sini
                      </Link>
                    </p>
                  </div>
                </AvForm>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      <SweetAlert
        title=""
        show={confirm}
        custom
        btnSize="md"
        reverseButtons={true}
        confirmBtnText="Ya"
        confirmBtnBsStyle="outline-primary"
        cancelBtnBsStyle="primary"
        onConfirm={handleGoVerification}
        style={{ padding: "30px 40px" }}
      >
        <p className="text-muted">
          Kode berhasil dikirim ke alamat email anda.
          <br />
          <small>Check spam jika tidak ada</small>
        </p>
      </SweetAlert>

      <SweetAlert
        title=""
        show={faild}
        custom
        btnSize="md"
        reverseButtons={true}
        confirmBtnText="Ya"
        confirmBtnBsStyle="outline-primary"
        cancelBtnBsStyle="primary"
        onConfirm={onFaildClikOk}
        style={{ padding: "30px 40px" }}
      >
        <p className="text-muted">{message}</p>
      </SweetAlert>
    </React.Fragment>
  );
}

export default ForgotPassword;

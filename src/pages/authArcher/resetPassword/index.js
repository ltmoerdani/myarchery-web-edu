import { AvField, AvForm } from "availity-reactstrap-validation";
import login_background from "assets/images/myachery/login-background.svg";
import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import { Link, useParams, useHistory } from "react-router-dom";
import { Col, Row, Container } from "reactstrap";
import { ArcherService } from "services";
import SweetAlert from "react-bootstrap-sweetalert";

import "./components/sass/styles.scss";

const ResetPasswordArcher = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [faild, setFaild] = useState(false);

  const { email } = useParams();
  const { push } = useHistory();

  const handleValidSubmit = async (event, values) => {
    const { data, message, errors } = await ArcherService.resetPassword({
      email: email,
      password: values?.password,
      confirm_password: values?.confirm_password,
    });

    if (data) {
      setMessage(message);
      setConfirm(true);
    }
    if (!data) {
      setMessage(message);
      console.log(errors);
      setFaild(true)

    }
  };

  const handleGoDone = () => push("/archer/reset-done");
  const onFaildClikOk = () => setFaild(false);

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
              <div className="mx-auto w-50" style={{ paddingTop: "25vh" }}>
                <div className="text-center">
                  <h2 style={{ color: "#0D47A1", fontSize: "32px", lineHeight: "38.4px" }}>
                    Buat Sandi
                  </h2>
                </div>
                <AvForm
                  className="form-horizontal"
                  onValidSubmit={(e, v) => {
                    handleValidSubmit(e, v);
                  }}
                >
                  <div className="mb-3 position-relative">
                    {/* TODO: Hapus nanti setelah semua ini beres */}
                    <div style={{ position: "absolute", top: "-1%", left: "20%" }}>
                      <span onClick={() => setShowPassword(!showPassword)}>
                        {!showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-eye-slash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-eye"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                          </svg>
                        )}
                      </span>
                    </div>
                    <AvField
                      name="password"
                      label="Kata Sandi"
                      type={!showPassword ? "password" : "text"}
                      required
                      placeholder="Masukkan Kata sandi"
                      errorMessage="kata sandi belum diisi"
                    />
                  </div>

                  <div className="mb-3 position-relative">
                    {/* TODO: Hapus nanti setelah semua ini beres */}
                    <div style={{ position: "absolute", top: "-1%", left: "40%" }}>
                      <span onClick={() => setShowPassword(!showPassword)}>
                        {!showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-eye-slash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-eye"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                          </svg>
                        )}
                      </span>
                    </div>
                    <AvField
                      name="confirm_password"
                      label="Konfirmasi Kata Sandi"
                      type={!showPassword ? "password" : "text"}
                      required
                      placeholder="Masukkan Kinfirmasi Kata Sandi"
                      errorMessage="konfirmasi kata sandi belum diisi"
                    />
                  </div>

                  <div className="mt-3 d-grid">
                    <button
                      className="btn"
                      style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                      type="submit"
                    >
                      Simpan
                    </button>
                  </div>
                  <div className="mt-2 d-grid">
                    <Link to="/archer/login">
                      <button
                        className="btn w-100"
                        style={{ backgroundColor: "#EEE", color: "#0D47A1" }}
                        type="button"
                      >
                        Batal
                      </button>
                    </Link>
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
        onConfirm={handleGoDone}
        style={{ padding: "30px 40px" }}
      >
        <p className="text-muted">{message}</p>
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
};

export default ResetPasswordArcher;

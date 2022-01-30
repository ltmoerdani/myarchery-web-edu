// availity-reactstrap-validation
import React, { useState, useEffect } from "react";
import { AvField, AvForm } from "availity-reactstrap-validation";
import MetaTags from "react-meta-tags";
import { useHistory, Link, useLocation } from "react-router-dom";
import { ArcherService } from "services";
import { Col, Container, Row, Input } from "reactstrap";
import toastr from "toastr";
import { useDispatch, useSelector } from "react-redux";
import * as AuthenticationStore from "store/slice/authentication";
import login_background from "assets/images/myachery/login-background.svg";

import "./components/sass/styles.scss";

import { DateInput } from "components";

const RegisterArcher = (props) => {
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const dispatch = useDispatch();
  let path = new URLSearchParams(useLocation().search).get("path");

  let history = useHistory();

  const handleValidSubmit = async (event, values) => {
    let payload = { ...values };
    payload["gender"] = gender;
    payload["date_of_birth"] = dateOfBirth;
    console.log(payload);
    const { data, errors, message, success } = await ArcherService.register(payload);
    if (success) {
      if (data) {
        dispatch(AuthenticationStore.login(data));
      }
    } else {
      console.log(errors);
      console.log(message);
      const err = Object.keys(errors).map((err) => err);
      console.log(err);
      if (err[0] == "email") {
        toastr.error(errors?.email[0]);
      }
      if (err[1] == "password") {
        toastr.error(errors?.password[0]);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      path =
        props.location.state && props.location.state.from && props.location.state.from.pathname
          ? props.location.state.from.pathname
          : path;

      if (path == null) {
        history.push("/archer/dashboard");
      } else {
        history.push(path);
      }
    }
  }, [isLoggedIn]);

  const getValueRadio = (e) => setGender(e.target.value);
  const getValueDateOfBirth = (e) => setDateOfBirth(e.value);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Register | MyArchery</title>
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
            <Col className="d-md-block d-none" md={5} sm={12} xs={12}></Col>
            <Col md={7} sm={12} xs={12}>
              <div className="position-relative">
                <div className="w-50 mx-auto responsive-form">
                  <div className="text-center">
                    <h2 style={{ color: "#0D47A1", fontSize: "32px", lineHeight: "38.4px" }}>
                      Buat Akun MyArchery
                    </h2>
                    <span style={{ fontSize: "20px", lineHeight: "28px" }}>
                      Satu akun untuk daftar berbagai event
                    </span>
                  </div>
                  <AvForm
                    className="form-horizontal"
                    onValidSubmit={(e, v) => {
                      handleValidSubmit(e, v);
                    }}
                  >
                    <div className="mb-2">
                      <AvField
                        name="name"
                        label="Nama Profile"
                        className="form-control"
                        placeholder="Masukkan nama profile"
                        type="text"
                        required
                        errorMessage="nama belum diisi"
                      />
                    </div>
                    <div className="mb-2">
                      <DateInput
                        name="date_of_birth"
                        label="Tanggal Lahir"
                        onChange={(e) => getValueDateOfBirth(e)}
                      />
                    </div>
                    <div className="mb-2">
                      <div style={{ marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "13px", fontWeight: "500" }}>Jenis kelamin</span>
                      </div>
                      <div className="d-flex">
                        <div className="form-check ms-2">
                          <Input
                            required
                            onChange={(e) => getValueRadio(e)}
                            style={{ width: "22px", height: "22px", border: "1px solid #0D47A1" }}
                            value="male"
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="flexRadioDefault1"
                          />
                          <label
                            style={{ fontSize: "14px" }}
                            className="form-check-label ms-2 pt-1"
                            htmlFor="flexRadioDefault1"
                          >
                            Pria
                          </label>
                        </div>
                        <div className="form-check ms-5">
                          <Input
                            required
                            onChange={(e) => getValueRadio(e)}
                            style={{ width: "22px", height: "22px", border: "1px solid #0D47A1" }}
                            value="female"
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="flexRadioDefault1"
                          />
                          <label
                            style={{ fontSize: "14px" }}
                            className="form-check-label ms-2 pt-1"
                            htmlFor="flexRadioDefault1"
                          >
                            Wanita
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
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
                    <div className="mb-2">
                      <AvField
                        name="password"
                        label="Kata Sandi"
                        type="password"
                        required
                        placeholder="Masukkan kata sandi"
                        errorMessage="kata sandi belum diisi"
                      />
                    </div>
                    <div className="mb-2">
                      <AvField
                        name="password_confirmation"
                        label="Konfirmasi Kata Sandi"
                        type="password"
                        required
                        placeholder="Masukkan kata sandi"
                        errorMessage="konfirmasi kata sandi belum diisi"
                      />
                    </div>

                    <div className="mt-3 d-grid">
                      <button
                        className="btn"
                        type="submit"
                        style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                      >
                        Daftar
                      </button>
                    </div>
                    <div className="mt-5 text-center">
                      <p>
                        Sudah memiliki akun masuk ?{" "}
                        <Link
                          to={path != null ? "/archer/login?path=" + path : "/archer/login"}
                          className="fw-medium text-primary"
                        >
                          {" "}
                          Disini{" "}
                        </Link>{" "}
                      </p>
                    </div>
                  </AvForm>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default RegisterArcher;

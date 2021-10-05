// availity-reactstrap-validation
import myachery from "assets/images/myachery/logo-myarchery.png";
import React, { useState, useEffect } from "react";
// import google from "assets/images/myachery/Google.png"
// import facebook from "assets/images/myachery/Facebook.png"
import ladBg from "assets/images/myachery/achery-lad.png";
import { AvField, AvForm } from "availity-reactstrap-validation";
import MetaTags from "react-meta-tags";
import { useHistory, Link, useLocation } from "react-router-dom";
import { ArcherService } from "services";
import { Col, Container, Row } from "reactstrap";
import toastr from "toastr";
import { useDispatch, useSelector } from "react-redux";
import * as AuthenticationStore from "store/slice/authentication";
// import logoImg from "../../../assets/images/logo.svg"
// import images
// import profileImg from "../../../assets/images/profile-img.png"

const RegisterArcher = (props) => {
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore);
  const [registerErrors, setRegisterErrors] = useState();
  const dispatch = useDispatch();
  let path = new URLSearchParams(useLocation().search).get("path");

  let history = useHistory();

  const handleValidSubmit = async (event, values) => {
    console.log(values);
    const { data, errors, message, success } = await ArcherService.register(values);
    if (success) {
      if (data) {
        dispatch(AuthenticationStore.login(data));
      }
    } else {
      console.log(errors);
      setRegisterErrors(errors);
      toastr.error(message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      path =
        props.location.state && props.location.state.from && props.location.state.from.pathname
          ? props.location.state.from.pathname
          : path;

      if (path == null) {
        history.push("/dashboard");
      } else {
        history.push(path);
      }
    }
  }, [isLoggedIn]);

  console.log(registerErrors);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Register | MyArchery</title>
      </MetaTags>
      <Container fluid>
        <div>
          <Row>
            <Col className="d-md-block d-none" md={5} sm={12} xs={12}>
              <img
                src={ladBg}
                style={{
                  height: "100vh",
                  zIndex: "-1",
                  position: "absolute",
                  left: "-1px",
                  width: "auto",
                }}
              />
              <div>
                <div style={{ paddingTop: "20vh" }} className=" mx-auto">
                  <img src={myachery} />
                </div>
                {/* <div style={{zIndex: '100'}}>
                  <div className="w-75 mx-auto">
                    <Link to={path != null ? "/archer/login?path="+path :"/archer/login"} className="text-decoration-none text-black-50">
                      <span style={{marginRight: '36px'}} className="font-size-18 text-white">Masuk</span>
                    </Link>
                    <Link to={path != null ? "/archer/register?path="+path :"/archer/register"} className="text-decoration-none text-black-50 text-decoration-underline">
                      <span className="font-size-18 text-white">Daftar</span>
                    </Link>
                  </div>
                </div> */}
              </div>
            </Col>
            <Col md={7} sm={12} xs={12}>
              <div className="w-50 mx-auto" style={{ paddingTop: "16vh" }}>
                <div className="text-center">
                  <h2 className="font-size-20 text-danger">Daftar ke myarchery.id</h2>
                </div>
                <AvForm
                  className="form-horizontal"
                  onValidSubmit={(e, v) => {
                    handleValidSubmit(e, v);
                  }}
                >
                  <div className="mb-2">
                    <AvField
                      name="email"
                      label="Email"
                      className="form-control"
                      placeholder="Masukkan email"
                      type="email"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <AvField
                      name="name"
                      label="Nama Profile"
                      className="form-control"
                      placeholder="Masukkan nama profile"
                      type="text"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <AvField
                      name="phone_number"
                      label="No. Handphone"
                      className="form-control"
                      placeholder="Masukkan No. Handphone"
                      type="number"
                    />
                  </div>
                  <div className="mb-2">
                    <AvField
                      name="password"
                      label="Kata Sandi"
                      type="password"
                      required
                      placeholder="Masukkan kata sandi"
                    />
                  </div>
                  <div className="mb-2">
                    <AvField
                      name="password_confirmation"
                      label="Konfirmasi Kata Sandi"
                      type="password"
                      required
                      placeholder="Masukkan kata sandi"
                    />
                  </div>

                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="customControlInline" />
                    <label className="form-check-label" htmlFor="customControlInline">
                      I Agree to Terms of Service and Privacy Policy
                    </label>
                  </div>
                  <div className="mt-3 d-grid">
                    <button className="btn btn-primary btn-block" type="submit">
                      Daftar
                    </button>
                  </div>
                  <div className="mt-5 text-center">
                    <p>
                      Sudah memiliki akun masuk ?{" "}
                      <Link
                        to={path != null ? "/login?path=" + path : "/login"}
                        className="fw-medium text-primary"
                      >
                        {" "}
                        Disini{" "}
                      </Link>{" "}
                    </p>
                    {/* <p>
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                </p> */}
                  </div>
                </AvForm>
                {/* <div className="d-flex justify-content-center pt-5">
                      <img src={facebook} style={{cursor: 'pointer'}} />
                      <img src={google} style={{cursor: 'pointer'}} />
                    </div> */}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default RegisterArcher;

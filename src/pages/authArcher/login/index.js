// import logo from "assets/images/logo.svg"
// import images
// import profile from "assets/images/profile-img.png"
// availity-reactstrap-validation
import { AvField, AvForm } from "availity-reactstrap-validation";
import myachery from "assets/images/myachery/logo-myarchery.png";
// import gmail from "assets/images/myachery/gmail.png"
// import google from "assets/images/myachery/Google.png";
// import facebook from "assets/images/myachery/Facebook.png";
import ladBg from "assets/images/myachery/achery-lad.png";
import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
// import { useDispatch, useSelector } from "react-redux"
  useLocation
import { useHistory, Link, useLocation } from "react-router-dom";
import { Col, Row, Container } from "reactstrap";
import { ArcherService } from "services";
//Import config
import toastr from "toastr";
import * as AuthenticationStore from "store/slice/authentication"
import { useDispatch, useSelector } from "react-redux";

const LoginArcher = (props) => {
  const dispatch = useDispatch()
  let history = useHistory()
  const [loginErrors, setLoginErrors] = useState();
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore)
  let path = new URLSearchParams(useLocation().search).get("path");

  const handleValidSubmit = async (event, values) => {
    const { data, errors, message, success } = await ArcherService.login(
      values
    );
    if (success) {
      if (data) {
        dispatch(AuthenticationStore.login(data))
      }
    } else {
      console.log(errors);
      setLoginErrors(errors);
      toastr.error(message);
    }
  };

  useEffect(() => {
    let pathFrom = props.location.state && props.location.state.from && props.location.state.from.pathname ? props.location.state.from.pathname : null;
  
    if (isLoggedIn) {
      if (path == null) {
        if (pathFrom != null){
          history.push(pathFrom)        
        }else{
          history.push("/archer/dashboard")        
        }
      }else{
        history.push(path)
      }
    }else{
      if (pathFrom != null && path == null && path != "/archer/logout"){
        history.push("/archer/login?path="+pathFrom)
      }
    }
  }, [isLoggedIn])

  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | MyArchery</title>
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
                {/* <div style={{ zIndex: "100" }}>
                  <div className="w-75 mx-auto">
                    <Link
                      to={path != null ? "/archer/login?path="+path :"/archer/login"}
                      className="text-decoration-none text-black-50 text-decoration-underline"
                    >
                      <span
                        style={{ marginRight: "36px" }}
                        className="font-size-18 text-white "
                      >
                        Masuk
                      </span>
                    </Link>
                    <Link
                      to={path != null ? "/archer/register?path="+path :"/archer/register"}
                      className="text-decoration-none text-black-50"
                    >
                      <span className="font-size-18 text-white">Daftar</span>
                    </Link>
                  </div>
                </div> */}
              </div>
            </Col>
            <Col md={7} sm={12} xs={12}>
              <div className="mx-auto w-50" style={{ paddingTop: "25vh" }}>
                <div className="text-center">
                  <h2 className="font-size-20 text-danger">
                    Masuk ke myarchery.id
                  </h2>
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
                      placeholder="Enter email"
                      type="email"
                      required
                    />
                    {loginErrors?.email ? (
                      <div className="validated-response">
                        {loginErrors?.email.join(", ")}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <AvField
                      name="password"
                      label="Password"
                      type="password"
                      required
                      placeholder="Enter Password"
                    />
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="customControlInline"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="customControlInline"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="mt-3 d-grid">
                    <button className="btn btn-primary btn-block" type="submit">
                      Log In
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    {/* <Link
                      to={"/authentication/forgot-password"}
                      className="text-muted"
                    >
                      <i className="mdi mdi-lock me-1" />
                      Forgot your password?
                    </Link> */}
                  </div>
                  <div className="mt-5 text-center">
                <p>
                  Belum memiliki akun daftar ?{" "}
                  <Link to={path != null ? "/archer/register?path="+path :"/archer/register"} className="fw-medium text-primary">
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
                  <img src={facebook} style={{ cursor: "pointer" }} />
                  <img src={google} style={{ cursor: "pointer" }} />
                </div> */}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default LoginArcher;

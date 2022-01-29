/* eslint-disable no-constant-condition */
import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import { AvField, AvForm } from "availity-reactstrap-validation";
import login_background from "assets/images/myachery/login-background.svg";
import { Container, Row, Col } from "reactstrap";
import { Link, useParams, useHistory } from "react-router-dom";
import Countdown from "react-countdown";
import { ArcherService } from "services";
import SweetAlert from "react-bootstrap-sweetalert";

import "./components/sass/styles.scss";

function Verification() {
  let countTime = 600000;
  // let countTime = 6000;
  const { push } = useHistory();

  const { email } = useParams();

  const [active, setActive] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [faild, setFaild] = useState(false);
  const [message, setMessage] = useState("");

  // const [btnDisable, setBtnDisable] = useState(false)
  const [count, setCount] = useState(
    <Countdown
      Countdown
      date={Date.now() + countTime}
      onComplete={() => {
        setActive(true);
        setCount(() => {});
      }}
    />
  );
  const [digit, setDigit] = useState({});

  const handlerSetDigit = (e) => {
    let payload = { ...digit };
    payload[e.target.name] = e.target.value;
    setDigit(payload);
  };

  console.log(Object.keys(digit).length);

  const handleValidSubmit = async (event, values) => {
    console.log(values);
    let number = [
      values?.digitSatu,
      values?.digitDua,
      values?.digitTiga,
      values?.digitEmpat,
      values?.digitLima,
    ].join("");
    console.log(parseInt(number));
    const { data, message, errors } = await ArcherService.verificationPassword({
      email: email,
      code: number,
    });
    if (data) {
      console.log(message);
      console.log(errors);
      setMessage(message)
      setConfirm(true)
    }
    if (!data) {
      setFaild(true)
      setMessage(message)
      console.log(message);
      console.log(errors);
    }
  };

  const onResendCode = async () => {
    const { data, message, errors } = await ArcherService.forgotPassword({email: email});
    if (data) {
      setFaild(true)
      setMessage(message)
      console.log(message)
      console.log(errors)
    }
    if (!data) {
      setFaild(true)
      setMessage(message)
      console.log(message)
      console.log(errors)
    }

  }

  const getCountDown = () => {
    setCount(() => (
      <Countdown
        date={Date.now() + countTime}
        onComplete={() => {
          setActive(true);
          setCount(() => {});
        }}
      />
    ));
  };

  const onConfrim = () => push(`/archer/reset-password/${email}`)
  const onFailed = () => setFaild(false)


  return (
    <React.Fragment>
      <MetaTags>
        <title>Verifikasi password | MyArchery</title>
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
                    Masukkan Kode
                  </h2>
                  <span style={{ fontSize: "20px", lineHeight: "28px" }}>
                    Kode telah dikirimkan ke email {email}
                  </span>
                </div>
                <AvForm
                  className="form-horizontal"
                  onValidSubmit={(e, v) => {
                    handleValidSubmit(e, v);
                  }}
                >
                  <div className="mb-3 mt-3 d-flex justify-content-around">
                    <div className="me-3">
                      <AvField
                        name="digitSatu"
                        onChange={(e) => handlerSetDigit(e)}
                        className="form-control btn-box-border font-size-24"
                        type="text"
                        maxlength={1}
                        required
                      />
                    </div>
                    <div className="me-3">
                      <AvField
                        name="digitDua"
                        onChange={(e) => handlerSetDigit(e)}
                        className="form-control btn-box-border font-size-24"
                        type="text"
                        maxlength={1}
                        required
                      />
                    </div>
                    <div className="me-3">
                      <AvField
                        name="digitTiga"
                        onChange={(e) => handlerSetDigit(e)}
                        className="form-control btn-box-border font-size-24"
                        type="text"
                        maxlength={1}
                        required
                      />
                    </div>
                    <div className="me-3">
                      <AvField
                        name="digitEmpat"
                        onChange={(e) => handlerSetDigit(e)}
                        className="form-control btn-box-border font-size-24"
                        type="text"
                        maxlength={1}
                        required
                      />
                    </div>
                    <div>
                      <AvField
                        name="digitLima"
                        onChange={(e) => handlerSetDigit(e)}
                        className="form-control btn-box-border font-size-24"
                        type="text"
                        maxlength={1}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt4">
                    {active ? (
                      <span
                        onClick={() => {
                          setActive(false);
                          getCountDown();
                          onResendCode();
                        }}
                        style={{ cursor: "pointer", color: "#0D47A1" }}
                      >
                        Kirim Ulang Kode
                      </span>
                    ) : (
                      <span style={{ color: "#AFAFAF" }}>Kirim Ulang Kode</span>
                    )}
                    <span style={{ float: "right" }}>{count}</span>
                  </div>

                  <div className="mt-4">
                    <div className="mt-3 d-grid">
                      <button
                        className="btn"
                        style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                        type="submit"
                      >
                        Verifkasi
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
        onConfirm={onConfrim}
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
        onConfirm={onFailed}
        style={{ padding: "30px 40px" }}
      >
        <p className="text-muted">{message}</p>
      </SweetAlert>
    </React.Fragment>
  );
}

export default Verification;

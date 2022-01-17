import React from 'react'
import MetaTags from "react-meta-tags";
import { AvField, AvForm } from "availity-reactstrap-validation";
import login_background from "assets/images/myachery/login-background.svg"
import {
    Container,
    Row, Col
} from 'reactstrap'
import { Link } from "react-router-dom"

import "./components/sass/styles.scss"


function ForgotPassword() {

    const handleValidSubmit = async (event, values) => {
        console.log(event)
        console.log(values)
      };
    return (
        <React.Fragment>
            <MetaTags>
            <title>Lupa password | MyArchery</title>
            </MetaTags>
      <Container fluid>
        <div className="position-relative">
            <div className="position-absolute d-md-block d-none" style={{zIndex: '1' ,width:"50%", height: '100vh'}}>
              <img className="img-circle" src={login_background} />
            </div>
            <div className="circle-blue d-md-block d-none"></div>
            <div className="circle-yellow d-md-block d-none"></div>
          <Row>
            <Col md={5} sm={12} xs={12}>
              
            </Col>
            <Col md={7} sm={12} xs={12}>
              <div className="mx-auto w-50" style={{ paddingTop: "25vh" }}>
                <div className="text-center">
                  <h2 style={{color: '#0D47A1', fontSize: '32px', lineHeight: '38.4px'}}>
                  Ubah Kata Sandi
                  </h2>
                  <span style={{fontSize:'20px', lineHeight: '28px'}}>Link reset kata sandi akan dikirimkan ke email di bawah ini</span>
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
                  </div>

                  <div className="mt-3 d-grid">
                    <button className="btn" style={{backgroundColor: '#0D47A1', color: '#FFF'}} type="submit">
                      Kirim
                    </button>
                  </div>

                  <div className="mt-5 text-center">
                <p>
                  Batal Ubah?{" "}
                  <Link to="/archer/login" className="fw-medium text-primary">
                    {" "}
                    Masuk di sini{" "}
                  </Link>{" "}
                </p>
               
              </div>
                </AvForm>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
        </React.Fragment>
    )
}

export default ForgotPassword

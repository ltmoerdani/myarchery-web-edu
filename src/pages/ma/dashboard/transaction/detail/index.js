import React, { useState, useEffect } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  Container,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { BreadcrumbDashboard } from "./components/breadcrumb";
import MetaTags from "react-meta-tags";
import classNames from "classnames";

import event_img from "assets/images/myachery/a-1.jpg";

import "./components/sass/sytles.scss";
import Avatar from "./components/Avatar";

function PageTransactionDetail() {
  const [activeTab, setActiveTab] = useState("1");

  const breadcrumpCurrentPageLabel = "Kembali";

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    const snapSrcUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = "SB-Mid-client-y_BGhv-exWF6m27x"; //change this according to your client-key

    const script = document.createElement("script");
    script.src = snapSrcUrl;
    script.setAttribute("data-client-key", myMidtransClientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleClickPayment = () => {
    console.log("klik bayar sekarang");
    window.snap.pay("8a38cec9-eb94-470f-a189-2b4c1ed33261", {
      onSuccess: function () {
        console.log("success");
      },
      onPending: function () {
        console.log("pending");
      },
      onError: function () {
        console.log("error");
      },
      onClose: function () {
        console.log("customer closed the popup without finishing the payment");
      },
    });
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Detail Transaction | MyArchery.id</title>
      </MetaTags>

      <Container>
        <BreadcrumbDashboard to="/dashboard">{breadcrumpCurrentPageLabel}</BreadcrumbDashboard>

        <div className="mt-5">
          <Nav style={{ backgroundColor: "#EEE" }}>
            <NavItem>
              <NavLink
                className={classNames({ activate: activeTab === "1" })}
                onClick={() => toggleTab("1")}
              >
                Event
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ activate: activeTab === "2" })}
                onClick={() => toggleTab("2")}
              >
                Peserta
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ activate: activeTab === "3" })}
                onClick={() => toggleTab("3")}
              >
                Pertandingan
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ activate: activeTab === "4" })}
                onClick={() => toggleTab("4")}
              >
                Pembayaran
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Card>
                <CardBody>
                  <div>
                    <Row>
                      <Col md={2}>
                        <div style={{ width: "128px", height: "128px" }}>
                          <img
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                              borderRadius: "10px",
                            }}
                            src={event_img}
                          />
                        </div>
                      </Col>
                      <Col md={10}>
                        <table>
                          <tr>
                            <td>Nama Event</td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td>: Pro Archery 2022</td>
                            <hr />
                          </tr>
                          <tr>
                            <td>Jenis Event</td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td>: DKI Jakarta Series</td>
                            <hr />
                          </tr>
                          <tr>
                            <td>Lokasi</td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td>: Jakarta</td>
                            <hr />
                          </tr>
                          <tr>
                            <td>Tanggal</td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td>: 01 Februari 2022 - 30 Maret 2022</td>
                            <hr />
                          </tr>
                        </table>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="2">
              <Card>
                <CardBody>
                  <div>
                    <table>
                      <tr>
                        <td>Nama Pendaftar</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>: Muhammad Fauzi</td>
                        <hr />
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>: teronggoren@gmail.com</td>
                        <hr />
                      </tr>
                      <tr>
                        <td>No. Telpon</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>: 0812345678</td>
                        <hr />
                      </tr>
                    </table>
                    <div style={{ backgroundColor: "#E7EDF6" }}>
                      <p className="p-2 font-size-16">Peserta</p>
                    </div>
                    <div className="d-flex">
                      <div style={{ width: "100px" }}>
                        <Avatar />
                      </div>
                      <div className="ms-4">
                        <h5>Muhammad Fauzi</h5>
                        <span>fauzi@gmail.com</span>
                        <br />
                        <span>Laki-laki</span>
                        <span> 24 tahun</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="3">
              <Card>
                <CardBody>
                  <div>
                    <table>
                      <tr>
                        <td>Jenis Regu</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>: Individu Putra</td>
                        <hr />
                      </tr>
                      <tr>
                        <td>Detal Katogri</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>: Umum - Barebow - 50m</td>
                        <hr />
                      </tr>
                    </table>
                    <div>
                      <div className="cut-text">hallo</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="4">
              <Card>
                <CardBody>
                  <div>
                    <Row>
                      <Col md={2}>
                        <div style={{ width: "128px", height: "128px" }}>
                          <img
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                              borderRadius: "10px",
                            }}
                            src={event_img}
                          />
                        </div>
                      </Col>
                      <Col md={10}>
                        <table>
                          <tr>
                            <td>
                              <h5>Pro Archery 2022</h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="mb-3">Lapangan Panahan Utama - Pro Archery</div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span
                                style={{
                                  backgroundColor: "#FFF8E9",
                                  color: "#FFB420",
                                  borderRadius: "10px",
                                }}
                                className="py-2 px-2"
                              >
                                Menunggu Pembayaran
                              </span>
                            </td>
                          </tr>
                        </table>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col md={2}>
                        <span>Jenis Regu</span>
                        <div>
                          <h5>Individu Putra</h5>
                        </div>
                      </Col>
                      <Col md={3}>
                        <span>Kategori</span>
                        <div>
                          <h5>Umum - Barebow - 50m</h5>
                        </div>
                      </Col>
                      <Col md={2}>
                        <span>Jumlah Peserta</span>
                        <div>
                          <h5>1 Orang</h5>
                        </div>
                      </Col>
                      <Col md={5}>
                        <div style={{ float: "right" }}>
                          <span>Biaya Pendaftaran</span>
                          <div>
                            <h5>Rp238,000</h5>
                          </div>
                          <div>
                            <button
                              onClick={handleClickPayment}
                              className="btn"
                              style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                            >
                              Bayar Sekarang
                            </button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>{" "}
              </Card>
            </TabPane>
          </TabContent>
        </div>
      </Container>
    </React.Fragment>
  );
}

export default PageTransactionDetail;

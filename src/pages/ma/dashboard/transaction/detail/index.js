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
import { OrderEventService } from "services";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";

import event_img from "assets/images/myachery/a-1.jpg";

import "./components/sass/sytles.scss";
import Avatar from "./components/Avatar";

function PageTransactionDetail() {
  const [activeTab, setActiveTab] = useState("1");
  const [dataDetail, setDataDetail] = useState({});

  const { orderId } = useParams();
  // eslint-disable-next-line no-unused-vars
  const { push } = useHistory();

  const breadcrumpCurrentPageLabel = "Kembali";

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const statusPayment = (status) => {
    if (status == 4) {
      return "menunggu-pembayaran";
    }
    if (status == 3) {
      return "gagal";
    }
    if (status == 2) {
      return "kadarluarsa";
    }
    if (status == 1) {
      return "di-ikuti";
    }
  };
  useEffect(() => {
    const getOrderEventBySlug = async () => {
      const { data, message, errors } = await OrderEventService.get({ id: orderId });

      if (data) {
        setDataDetail(data);
        if (dataDetail?.transactionInfo?.statusId == 4) {
          handleClickPayment();
        }
        console.log(message);
      }
      console.log(errors);
    };

    getOrderEventBySlug();
  }, [dataDetail?.transactionInfo?.snapToken]);

  useEffect(() => {
    const snapSrcUrl = `${dataDetail?.transactionInfo?.clientLibLink}`;
    const myMidtransClientKey = `${dataDetail?.transactionInfo?.clientKey}`; //change this according to your client-key

    const script = document.createElement("script");
    script.src = snapSrcUrl;
    script.setAttribute("data-client-key", myMidtransClientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [dataDetail?.transactionInfo?.clientLibLink, dataDetail?.transactionInfo?.clientKey]);

  const handleClickPayment = () => {
    window.snap?.pay(dataDetail?.transactionInfo?.snapToken, {
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

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateEventStart = new Date(dataDetail?.archeryEvent?.eventStartDatetime);
  const dateEventEnd = new Date(dataDetail?.archeryEvent?.eventEndDatetime);

  const handlerEvenDate = (date) => {
    const dateEvent = `${date?.getDate()} ${months[date?.getMonth()]} ${date?.getFullYear()}`;
    return dateEvent;
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
            {/* <NavItem>
              <NavLink
                className={classNames({ activate: activeTab === "3" })}
                onClick={() => toggleTab("3")}
              >
                Pertandingan
              </NavLink>
            </NavItem> */}
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
                            src={dataDetail?.archeryEvent?.poster || event_img}
                          />
                        </div>
                      </Col>
                      <Col md={10}>
                        <table>
                          <tr>
                            <td>Nama Event</td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td>: {dataDetail?.archeryEvent?.eventName}</td>
                            <hr />
                          </tr>
                          <tr>
                            <td>Jenis Event</td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td>: {dataDetail?.archeryEvent?.eventType}</td>
                            <hr />
                          </tr>
                          <tr>
                            <td>Lokasi</td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td>: {dataDetail?.archeryEvent?.location}</td>
                            <hr />
                          </tr>
                          <tr>
                            <td>Tanggal</td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td>
                              : {handlerEvenDate(dateEventStart)} - {handlerEvenDate(dateEventEnd)}
                            </td>
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
                        <td>: {dataDetail?.participant?.name}</td>
                        <hr />
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>: {dataDetail?.participant?.email}</td>
                        <hr />
                      </tr>
                      <tr>
                        <td>No. Telpon</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>: {dataDetail?.participant?.phoneNumber}</td>
                        <hr />
                      </tr>
                    </table>
                    <div style={{ backgroundColor: "#E7EDF6" }}>
                      <p className="p-2 font-size-16">Peserta</p>
                    </div>
                    {dataDetail?.participant?.members.map((member) => {
                      return (
                        <div key={member?.id} className="d-flex">
                          <div style={{ width: "100px" }}>
                            <Avatar />
                          </div>
                          <div className="ms-4">
                            <h5>{member?.name}</h5>
                            <span>{member?.email}</span>
                            <br />
                            <span>{member?.gender === "male" ? "Laki-laki" : "Perempuan"}</span>
                            <span> {member?.age} tahun</span>
                          </div>
                        </div>
                      );
                    })}
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
                        <td>: {dataDetail?.participant?.teamCategoryId}</td>
                        <hr />
                      </tr>
                      <tr>
                        <td>Detal Katogri</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>
                          : {dataDetail?.participant?.ageCategoryId} -{" "}
                          {dataDetail?.participant?.competitionCategoryId} -{" "}
                          {dataDetail?.participant?.distanceId}m
                        </td>
                        <hr />
                      </tr>
                    </table>
                    <hr />
                    <div>
                      <div>
                        <div>
                          <h5>Detail Pertandingan</h5>
                          {/* <div>
                            <span className="p-1 btn mt-2" style={{ backgroundColor: "#EEE" }}>
                              Selesai
                            </span>
                            <div className="mt-2">
                              <h5>Gugur - Pro Archery 2022</h5>
                              <table>
                                <tr>
                                  <td>Hari</td>
                                  <td>Tanggal</td>
                                  <td></td>
                                  <td>Jam</td>
                                  <td style={{ paddingLeft: "64px" }}>Bantalan</td>
                                </tr>
                                <tr>
                                  <td>Sabtu</td>
                                  <td>31 Desember 2022</td>
                                  <td></td>
                                  <td>08:00</td>
                                  <td style={{ paddingLeft: "64px" }}>A1</td>
                                </tr>
                              </table>
                            </div>
                          </div> */}
                          {/* <div className="mt-4">
                            <span
                              className="p-1 btn mt-2"
                              style={{ backgroundColor: "#E3DDF2", color: "#453473" }}
                            >
                              Kualifikasi
                            </span>
                            <div className="mt-2">
                              <h5>Gugur - Pro Archery 2022</h5>
                              <table>
                                <tr>
                                  <td>Hari</td>
                                  <td>Tanggal</td>
                                  <td></td>
                                  <td>Jam</td>
                                  <td style={{ paddingLeft: "64px" }}>Bantalan</td>
                                </tr>
                                <tr>
                                  <td>Sabtu</td>
                                  <td>31 Desember 2022</td>
                                  <td></td>
                                  <td>08:00</td>
                                  <td style={{ paddingLeft: "64px" }}>A1</td>
                                </tr>
                              </table>
                            </div>
                          </div> */}
                          {/* <div className="mt-4">
                            <span
                              className="p-1 btn mt-2"
                              style={{ backgroundColor: "#FFF8E9", color: "#FFB420" }}
                            >
                              Menungu Pembayaran
                            </span>
                            <div className="mt-2">
                              <h5>Gugur - Pro Archery 2022</h5>
                              <table>
                                <tr>
                                  <td>Hari</td>
                                  <td>Tanggal</td>
                                  <td></td>
                                  <td>Jam</td>
                                  <td style={{ paddingLeft: "64px" }}>Bantalan</td>
                                </tr>
                                <tr>
                                  <td>Sabtu</td>
                                  <td>31 Desember 2022</td>
                                  <td></td>
                                  <td>08:00</td>
                                  <td style={{ paddingLeft: "64px" }}>-</td>
                                </tr>
                              </table>
                            </div>
                            <div className="w-50">
                              <span className="ps-2">Biaya Pendaftaran</span>
                              <span style={{ float: "right" }}>RP 205.000</span>
                            </div>
                          </div> */}
                          {/* <div className="mt-4">
                            <span className="p-1 btn mt-2" style={{ backgroundColor: "#EEE" }}>
                              Daftar
                            </span>
                            <div className="mt-2">
                              <h5>Gugur - Pro Archery 2022</h5>
                              <table>
                                <tr>
                                  <td>Hari</td>
                                  <td>Tanggal</td>
                                  <td></td>
                                  <td>Jam</td>
                                  <td style={{ paddingLeft: "64px" }}>Bantalan</td>
                                </tr>
                                <tr>
                                  <td>Sabtu</td>
                                  <td>31 Desember 2022</td>
                                  <td></td>
                                  <td>08:00</td>
                                  <td style={{ paddingLeft: "64px" }}>-</td>
                                </tr>
                              </table>
                              <div className="w-50">
                                <span className="ps-2">Biaya Pendaftaran</span>
                                <span style={{ float: "right" }}>RP 205.000</span>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
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
                            src={dataDetail?.archeryEvent?.poster || event_img}
                          />
                        </div>
                      </Col>
                      <Col md={10}>
                        <table>
                          <tr>
                            <td>
                              <h5>{dataDetail?.archeryEvent?.eventName}</h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="mb-3">{dataDetail?.archeryEvent?.location}</div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <WrapperPaymentStatus>
                                <span
                                  style={{ borderRadius: "10px", padding: "8px" }}
                                  className={statusPayment(dataDetail?.transactionInfo?.statusId)}
                                >
                                  {dataDetail?.transactionInfo?.status}
                                </span>
                              </WrapperPaymentStatus>
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
                          <h5>{dataDetail?.participant?.teamCategoryId}</h5>
                        </div>
                      </Col>
                      <Col md={3}>
                        <span>Kategori</span>
                        <div>
                          <h5>
                            {dataDetail?.participant?.ageCategoryId} -{" "}
                            {dataDetail?.participant?.competitionCategoryId} -{" "}
                            {dataDetail?.participant?.distanceId}m
                          </h5>
                        </div>
                      </Col>
                      <Col md={2}>
                        <span>Jumlah Peserta</span>
                        <div>
                          <h5>{dataDetail?.participant?.members.length} Orang</h5>
                        </div>
                      </Col>
                      <Col md={5}>
                        <div style={{ float: "right" }}>
                          <span>Biaya Pendaftaran</span>
                          <div>
                            <h5>Rp.{dataDetail?.transactionInfo?.total}</h5>
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

const WrapperPaymentStatus = styled.div`
  .menunggu-pembayaran {
    background-color: #fff8e9;
    color: #ffb420;
  }

  .gagal {
    background-color: #f1998e;
    color: #e11900;
  }

  .di-ikuti {
    background-color: #66d19e;
    color: #03703c;
  }

  .kadarluarsa {
    background-color: #afafaf;
    color: #000;
  }
`;

export default PageTransactionDetail;

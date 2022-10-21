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
import { useSelector } from "react-redux";
import { BreadcrumbDashboard } from "./components/breadcrumb";
import MetaTags from "react-meta-tags";
import classNames from "classnames";
import { OrderEventService } from "services";
import { useParams, useHistory, Link } from "react-router-dom";
import styled from "styled-components";
import { Button, ButtonBlue } from "components/ma";
import SweetAlert from "react-bootstrap-sweetalert";
import * as AuthStore from "store/slice/authentication";
import logoBuatAkun from "assets/images/myachery/Illustration.png";

import event_img from "assets/images/myachery/a-1.jpg";

import "./components/sass/sytles.scss";

function PageTransactionDetailOfficial() {
  const [activeTab, setActiveTab] = useState("4");
  const [dataDetail, setDataDetail] = useState({});
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);

  const { slug } = useParams();
  // eslint-disable-next-line no-unused-vars
  const { push } = useHistory();

  const breadcrumpCurrentPageLabel = "Kembali";

  const onConfirm = () => {
    push("/dashboard/profile/verifikasi");
  };

  const onCancel = () => {
    setIsAlertOpen(false);
  };

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
      return "kedaluwarsa";
    }
    if (status == 1) {
      return "di-ikuti";
    }

  };

  useEffect(() => {
    if (userProfile?.verifyStatus != 3) {
      setIsAlertOpen(true);
    }
  }, []);

  console.log(slug);
  useEffect(() => {
    const getOrderEventBySlug = async () => {
      const { data, message, errors } = await OrderEventService.getDetailOrderOfficial({event_official_id: slug});

    //   const { data, message, errors } = await OrderEventService.get({id: orderId});

      if (data) {
        setDataDetail(data);
        if (dataDetail?.transactionInfo?.statusId == 4 && userProfile?.verifyStatus == 1) {
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

  const verifiedAlert = () => {
    if (userProfile?.verifyStatus == 1) {
      return null;
    }
    if (userProfile?.verifyStatus == 2) {
      return (
        <>
          <SweetAlert
            show={isAlertOpen}
            title=""
            custom
            btnSize="md"
            onConfirm={onConfirm}
            style={{ padding: "1.25rem" }}
            customButtons={
              <span className="d-flex w-100 justify-content-center" style={{ gap: "0.5rem" }}>
                <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
                  Nanti Saja
                </Button>
                <ButtonBlue onClick={onConfirm}>Ya, lengkapi data</ButtonBlue>
              </span>
            }
          >
            <div className="d-flex justify-content-center flex-column">
              <div style={{ width: "60%", margin: "0 auto" }}>
                <div style={{ width: "214px", height: "145px" }}>
                  <img
                    src={logoBuatAkun}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <span
                style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24px" }}
                className="mt-3"
              >
                Verifikasi Akun
              </span>
              <p>
                Proses verifikasi Anda hampir selesai,
                <br />
                <span>{userProfile?.reasonRejected}</span>
              </p>
            </div>
          </SweetAlert>
        </>
      );
    }
    if (userProfile?.verifyStatus == 3) {
      return (
        <>
          <SweetAlert
            show={isAlertOpen}
            title=""
            custom
            btnSize="md"
            onConfirm={() => push("/dashboard")}
            style={{ padding: "1.25rem" }}
            customButtons={
              <span className="d-flex w-100 justify-content-center" style={{ gap: "0.5rem" }}>
                <Button onClick={onCancel}>Lihat Detail Event</Button>
              </span>
            }
          >
            <div className="d-flex justify-content-center flex-column">
              <div style={{ width: "60%", margin: "0 auto" }}>
                <div style={{ width: "214px", height: "145px" }}>
                  <img
                    src={logoBuatAkun}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <p>
                Terima kasih telah melengkapi data. Data Anda akan diverifikasi dalam 1x24 jam.
                proses pembayaran akan bisa dilakukan setelah akun terverifikasi
              </p>
            </div>
          </SweetAlert>
        </>
      );
    }
    if (userProfile?.verifyStatus == 4) {
      return (
        <>
          <SweetAlert
            show={isAlertOpen}
            title=""
            custom
            btnSize="md"
            onConfirm={onConfirm}
            style={{ padding: "1.25rem" }}
            customButtons={
              <span className="d-flex w-100 justify-content-center" style={{ gap: "0.5rem" }}>
                <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
                  Nanti Saja
                </Button>
                <ButtonBlue onClick={onConfirm}>Ya, lengkapi data</ButtonBlue>
              </span>
            }
          >
            <div className="d-flex justify-content-center flex-column">
              <div style={{ width: "60%", margin: "0 auto" }}>
                <div style={{ width: "214px", height: "145px" }}>
                  <img
                    src={logoBuatAkun}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <span
                style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24px" }}
                className="mt-3"
              >
                Verifikasi Akun
              </span>
              <p>
                Event yang Anda ikuti mewajibkan user untuk melengkapi data. Silakan lengkapi data
                untuk dapat mengikuti berbagai event panahan.
              </p>
            </div>
          </SweetAlert>
        </>
      );
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Detail Transaction | MyArchery.id</title>
      </MetaTags>

      <Container>
        <BreadcrumbDashboard to="/dashboard/list-transaction">
          {breadcrumpCurrentPageLabel}
        </BreadcrumbDashboard>

        <div className="mt-5">
          <Nav style={{ backgroundColor: "#EEE" }}>
            {/* <NavItem>
              <NavLink
                className={classNames({ activate: activeTab === "1" })}
                onClick={() => toggleTab("1")}
              >
                Event
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
            <NavItem>
              <NavLink
                className={classNames({ activate: activeTab === "2" })}
                onClick={() => toggleTab("2")}
              >
                Data Official
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
                            src={dataDetail?.eventOfficialDetail?.detailEvent?.publicInformation?.eventBanner || event_img}
                          />
                        </div>
                      </Col>
                      <Col md={10}>
                        <table>
                          <tbody>
                            <tr>
                              <td>Nama Event</td>
                              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                              <td>: {dataDetail?.eventOfficialDetail?.detailEvent?.publicInformation?.eventName}</td>
                              <hr />
                            </tr>
                            <tr>
                              <td>Jenis Event</td>
                              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                              <td>: {dataDetail?.eventOfficialDetail?.detailEvent?.eventType}</td>
                              <hr />
                            </tr>
                            <tr>
                              <td>Lokasi</td>
                              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                              <td>: {dataDetail?.eventOfficialDetail?.detailEvent?.publicInformation?.eventLocation}</td>
                              <hr />
                            </tr>
                            <tr>
                              <td>Tanggal</td>
                              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                              <td>
                                :{" "}
                                {/* {dataDetail?.archeryEvent?.eventStartDatetime && ( */}
                                  <React.Fragment>
                                    {dataDetail?.eventOfficialDetail?.detailEvent?.publicInformation?.eventStart} -{" "}
                                    {dataDetail?.eventOfficialDetail?.detailEvent?.publicInformation?.eventEnd}
                                  </React.Fragment>
                                {/* )} */}
                              </td>
                              <hr />
                            </tr>
                          </tbody>
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
                      <tbody>
                        <tr>
                          <td>Nama Pendaftar</td>
                          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td>: {dataDetail?.detailUser?.name}</td>
                          <hr />
                        </tr>
                        <tr>
                          <td>Email</td>
                          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td>: {dataDetail?.detailUser?.email}</td>
                          <hr />
                        </tr>
                        <tr>
                          <td>No. Telpon</td>
                          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td>: {dataDetail?.detailUser?.phoneNumber}</td>
                          <hr />
                        </tr>
                      </tbody>
                    </table>
                    {/* <div style={{ backgroundColor: "#E7EDF6" }}>
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
                    })} */}
                  </div>
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="3">
              <Card>
                <CardBody>
                  <div>
                    <table>
                      <tbody>
                        <tr>
                          <td>Jenis Regu</td>
                          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td>: Official</td>
                          <hr />
                        </tr>
                        <tr>
                          <td>Detal Kategori</td>
                          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td>
                            : {dataDetail?.detailEventOfficial?.categoryLabel}
                          </td>
                          <hr />
                        </tr>
                      </tbody>
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
                            src={dataDetail?.eventOfficialDetail?.detailEvent?.publicInformation?.eventBanner || event_img}
                          />
                        </div>
                      </Col>
                      <Col md={10}>
                        <table>
                          <tbody>
                            <tr>
                              <td>
                                <h5>{dataDetail?.eventOfficialDetail?.detailEvent?.publicInformation?.eventName}</h5>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="mb-3">{dataDetail?.eventOfficialDetail?.detailEvent?.publicInformation?.eventLocation}</div>
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
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      {/* <Col md={2}>
                        <span>Jenis Regu</span>
                        <div>
                          <h5>{dataDetail?.detailEventOfficial?.teamCategoryId}</h5>
                        </div>
                      </Col> */}
                      <Col md={6}>
                        <span>Kategori</span>
                        <div>
                          <h5>
                            Official
                          </h5>
                        </div>
                      </Col>
                      {/* <Col md={2}>
                        <span>Jumlah Peserta</span>
                        <div>
                          <h5>{dataDetail?.participant?.members.length} Orang</h5>
                        </div>
                      </Col> */}
                      <Col md={5}>
                        <div style={{ float: "right" }}>
                          <span>Biaya Pendaftaran</span>
                          <div>
                            <h5>Rp.{dataDetail?.transactionInfo?.total}</h5>
                          </div>
                          {dataDetail?.transactionInfo?.statusId != 1 ? (
                            <div>
                              {dataDetail?.transactionInfo?.statusId == 4 ? (
                                <>
                                  <button
                                    onClick={
                                      userProfile?.verifyStatus != 1
                                        ? () => setIsAlertOpen(true)
                                        : handleClickPayment
                                    }
                                    className="btn"
                                    style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                                  >
                                    Bayar Sekarang
                                  </button>
                                  <p style={{ textAlign: "center" }}>
                                    code : {dataDetail?.transactionInfo?.orderId}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <ButtonBlue
                                    as={Link}
                                    to={`/event-registration-official/${dataDetail?.eventOfficialDetail?.detailEvent?.publicInformation?.eventSlug}?categoryId=${dataDetail?.detailEventOfficial?.eventOfficialId}`}
                                    className="btn"
                                    style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                                  >
                                    Daftar Lagi
                                  </ButtonBlue>
                                </>
                              )}
                            </div>
                          ) : null}
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
      {verifiedAlert()}
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

// util
// function formatFullDate(date) {
//   const dateObject = typeof date === "string" ? parseISO(date) : date;
//   return format(dateObject, "d MMMM yyyy", { locale: id });
// }

export default PageTransactionDetailOfficial;

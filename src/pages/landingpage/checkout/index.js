import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import HeaderForm from "layouts/landingpage/HeaderForm";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import styled from "styled-components";
import Avatar from "../../../assets/images/users/avatar-man.png";
import { OrderEventService } from "services";
import { useParams } from "react-router-dom";
import logoLight from "../../../assets/images/myachery/myachery.png";
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";
// import QRCode from "qrcode.react";
import { QRCode } from 'react-qr-svg'
import { LoadingScreen } from "components"

const H5 = styled.h5`
  font-size: 13px;
  line-height: 19px;
  color: #74788d;
  font-weight: normal;
`;

const CheckoutEvent = () => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const { id } = useParams();
  let { userProfile } = useSelector(getAuthenticationStore);

  const handleClickPayment = (snapToken = "") => {
    window.snap.pay(`${info.transactionInfo ? info.transactionInfo.snapToken : snapToken}`, {
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

  useEffect(async () => {
    const { data, errors, message, success } = await OrderEventService.get({
      id,
    });
    if (success) {
      if (data) {
        if (data.transactionInfo.statusId == 4) {
          handleClickPayment(data.transactionInfo.snapToken);
        }

        setInfo(data);
        setLoading(false);
      }
    } else {
      console.error(message, errors);
    }
  }, []);

  let formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const hrefToCertificateList = (eventId, memberId) =>
    `/archer/event/${eventId}/member/${memberId}/certificates`;

  return (
    <React.Fragment>
      <MetaTags>
        <title>Checkout Events | MyAchery</title>
      </MetaTags>
      {/* import navbar */}
      <HeaderForm />

      <Container fluid className="px-5 p-2 mb-5">
        <LoadingScreen loading={loading} />
        <Card>
          <CardBody>
            <Row>
              <Col md={1}>
                <div>
                  <img
                    src={Avatar}
                    alt=""
                    className="avatar-md rounded-circle img-thumbnail"
                    style={{ height: "auto" }}
                  />
                </div>
              </Col>
              <Col md={4}>
                <H5>Welcome to MyArchery.id dashboard</H5>
                <div className="text-muted">
                  <h4>{userProfile?.name}</h4>
                  {/* <H5>Klub FAST</H5> */}
                </div>
              </Col>
              <Col md={4}>
                <div>
                  <div className="d-flex">
                    <div className="text-muted" style={{ marginRight: "1rem" }}>
                      <h4>No. Ponsel</h4>
                      <H5>{userProfile?.phoneNumber}</H5>
                    </div>
                    <div className="text-muted">
                      <h4>Email</h4>
                      <H5>{userProfile?.email}</H5>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={3}>
                <div className="float-md-end">
                  <Button
                    disabled
                    href="/full-day"
                    type="button"
                    size="sm"
                    style={{ backgroundColor: "#0D47A1" }}
                  >
                    Setting
                  </Button>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Row>
              <Col md={3} sm={12}>
                <div style={{ textAlign: "center" }} className="mb-4">
                  <img
                    src={
                      info.archeryEvent != undefined &&
                      info.archeryEvent.poster != null &&
                      info.archeryEvent.poster
                        ? info.archeryEvent.poster
                        : logoLight
                    }
                    height="130"
                  />
                </div>
                </Col>
                <Col md={9} sm={12}>
                  <Row>
                    <Col sm={12}>
                  <H5 className="mx-md-5">Detail Order</H5>
                  <div className="d-md-flex">
                    <div className="mx-md-5 text-muted">
                      <H5>ID ORDER</H5>
                      <h4>{info.transactionInfo?.orderId}</h4>
                    </div>
                    <div className="mx-md-5 text-muted">
                      <H5>Total</H5>
                      <h4>{formatter.format(info.transactionInfo?.total)}</h4>
                    </div>
                    <div className="mx-md-5 text-muted">
                      <H5>Status Pembayaran</H5>

                      {info.transactionInfo != undefined &&
                      info.transactionInfo.statusId == 1 ? (
                        <h4 style={{ color: "green" }} className="fw-medium">
                          <i>{info.transactionInfo.status}</i>
                        </h4>
                      ) : info.transactionInfo != undefined &&
                        info.transactionInfo.statusId == 4 ? (
                        <h4 style={{ color: "red" }} className="fw-medium">
                          <i className="me-sm-2">{info.transactionInfo.status}</i>
                          <span className="btn btn-primary mt-2" onClick={() => {
                            window.location.reload();
                          }}>Check status</span>
                        </h4>
                      ) : (
                        <h4 style={{ color: "gray" }} className="fw-medium">
                          <i>
                            {info.transactionInfo
                              ? info.transactionInfo.status
                              : ""}
                          </i>
                        </h4>
                      )}
                    </div>
                    <div>
                      {/* <QRCode value={info.transactionInfo?.orderId} /> */}
                      {info.transactionInfo != undefined &&
                        info.transactionInfo.statusId == 0 ?
                          <QRCode 
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="Q"
                            style={{ width: 100 }}
                            value={`${info.transactionInfo?.orderId}`}
                          /> : ""}
                    </div>
                  </div>
                  <hr />
                  </Col>
                  <Col sm={12}>
                      <H5 className="mx-md-5">Event</H5>
                  <div className="d-md-flex">
                    <div className="mx-md-5 text-muted">
                      <h5>{info.archeryEvent?.eventName}</h5>
                    </div>
                    <div className="mx-md-5 text-muted">
                      <H5>Lokasi</H5>
                      <h5>{info.archeryEvent?.location}</h5>
                    </div>
                    <div className="mx-md-5 text-muted">
                      <H5>Peserta</H5>
                      {info.participant && info.participant.members ? (
                        info.participant.members.map((i) => (
                          <li key={i}>{i.name}</li>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="mx-md-5 text-muted">
                      <H5>Kategori</H5>
                      <h6>{info.participant?.categoryLabel}</h6>
                    </div>
                  </div>
                  <hr />
                  </Col>

                  <Col sm={12}>
                  <div className="d-flex justify-content-between">
                    <div className="mx-md-5 text-muted">
                      <H5>Tanggal Kualifikasi</H5>
                      <p>{info.archeryEvent?.eventStartDatetime}</p>
                    </div>
                    <div className="mx-md-5 text-muted">
                    {info.transactionInfo != undefined &&
                      info.transactionInfo.statusId == 1 ? 
                      <div>
                        <Button
                          href={
                            info.participant ? "/display/stages/" + info.archeryEvent.eventSlug : ""
                          }
                          type="button"
                          size="sm"
                          style={{ backgroundColor: "#0D47A1" }}
                        >
                          Pilih Jadwal Kualifikasi
                        </Button>
                      </div>
                      :null}
                      <Button
                          href={info.participant ?"/display/stages/"+info.archeryEvent.eventSlug : ""}
                          type="button"
                          size="sm"
                          style={{ backgroundColor: "#0D47A1" }}
                        >
                          Jadwal Eliminasi
                      </Button>
                    </div>
                  </div>
                  <hr />
                  </Col>

                  {info?.transactionInfo?.statusId === 1 && info?.archeryEvent?.id && (
                    <Col sm={12}>
                      <div className="d-flex justify-content-between">
                        <div className="mx-md-5 text-muted" />

                        <div className="d-flex flex-column align-items-end mx-md-5 text-muted">
                          <Button
                            type="button"
                            href={hrefToCertificateList(
                              info.archeryEvent.id,
                              info.participant.members[0].id
                            )}
                            style={{ backgroundColor: "#0D47A1" }}
                          >
                            Lihat Sertifikat Event <i className="mdi mdi-chevron-right" />
                          </Button>
                        </div>
                      </div>
                    </Col>
                  )}

                  {info.transactionInfo != undefined &&
                      info.transactionInfo.statusId == 4 ?
                <Button
                  type="button"
                  size="md"
                  onClick={handleClickPayment}
                  style={{ backgroundColor: "#0D47A1" }}
                >
                  LAKUKAN PEMBAYARAN
                </Button>
                : null}
                </Row>
                </Col>
                </Row>
            </CardBody>
          </Card>
      </Container>
    </React.Fragment>
  );
};

export default CheckoutEvent;

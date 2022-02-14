import React, { useEffect, useState } from "react";
import { url } from "utils";
import { Button, Container, Row, Col, Card, CardBody } from "reactstrap";
import MetaTags from "react-meta-tags";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import CardAbout from "./components/CardAbout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";
import { Landingpage } from "services";

import banner_satu from "../../../assets/images/myachery/banner6 1.svg";
import banner_dua_hero from "../../../assets/images/myachery/banner6 2.svg";
import banner_tiga_hero from "../../../assets/images/myachery/banner6 3.svg";
import img_target from "../../../assets/images/myachery/target-landing-1.svg";
import ases_satu from "../../../assets/images/myachery/ases-satu.svg";
import ases_dua from "../../../assets/images/myachery/ases-dua.svg";
import ases_tiga from "../../../assets/images/myachery/ases-tiga.svg";
import banner_dua from "../../../assets/images/myachery/bANNER2 1.svg";
import banner_tiga from "../../../assets/images/myachery/bANNER3a 1.svg";
import series_satu from "../../../assets/images/myachery/image 6.svg";
import series_dua from "../../../assets/images/myachery/image 4.svg";
import series_tiga from "../../../assets/images/myachery/image 5.svg";
import series_empat from "../../../assets/images/myachery/image 7.svg";
import img_about_satu from "../../../assets/images/myachery/image 25.svg";
import img_about_dua from "../../../assets/images/myachery/image 32.svg";
import img_about_tiga from "../../../assets/images/myachery/image 31.svg";
import img_about_empat from "../../../assets/images/myachery/image 29.svg";
import img_about_lima from "../../../assets/images/myachery/image 30.svg";
import img_about_enam from "../../../assets/images/myachery/image 28.svg";
import img_usedby_satu from "../../../assets/images/myachery/image 20.svg";
import img_usedby_dua from "../../../assets/images/myachery/image 19.svg";
import img_usedby_tiga from "../../../assets/images/myachery/image 18.svg";

import "./components/sass/header.scss";
//TODO: Clrea all the comment before commit please

const { getWebAdminURL } = url;

function Home() {
  const [dataEvent, setDataEventList] = useState([]);
  const [loading, setLoading] = useState(false);

  let { isLoggedIn } = useSelector(getAuthenticationStore);

  const screenLoading = () => {
    return (
      <div style={{ height: "50vh" }} className="d-flex justify-content-center align-items-center">
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getEventListbyLimit();
  }, []);

  const getEventListbyLimit = async () => {
    const { message, errors, data } = await Landingpage.getEvent({
      limit: 3,
    });
    if (data) {
      setDataEventList(data);
      setLoading(true);
    }
    console.log(message);
    console.log(errors);
  };

  const getDateEvent = (number) => {
    const monthNames = [
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
    let date = new Date(dataEvent[number]?.eventStartDatetime);
    let startDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    let dateend = new Date(dataEvent[number]?.eventEndDatetime);
    let EndDate = `${dateend.getDate()} ${monthNames[dateend.getMonth()]} ${dateend.getFullYear()}`;
    return (
      <>
        <span>
          {startDate}-{EndDate}
        </span>
      </>
    );
  };

  let numberEventOne = 0;
  let numberEventTwo = 1;

  return (
    <React.Fragment>
      <MetaTags>
        <title>Home | MyArchery</title>
      </MetaTags>
      <Carousel
        showArrows={false}
        infiniteLoop
        autoPlay
        showThumbs={false}
        swipeScrollTolerance={5}
        interval={2000}
        showStatus={false}
      >
        <div className="position-relative">
          <img src={banner_satu} />
          <div className="text-box">
            <span className="title-sub">
              selamat datang di
              <br />
            </span>
            <span className="title-hero">myarchery</span>
            <div className="content">
              <p>Temukan dan Ikuti berbagai macam Event Panahan di MyArchery</p>
              <a href="#list-event" className="btn btn-hero">
                <span className="btn-hero-text" style={{ fontWeight: "bold" }}>
                  Lihat Event
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="position-relative">
          <img src={banner_dua_hero} />
          <div className="text-box">
            <span className="title-sub">
              selamat datang di
              <br />
            </span>
            <span className="title-hero">myarchery</span>
            <div className="content">
              <p>Temukan dan Ikuti berbagai macam Event Panahan di MyArchery</p>
              <a href="#list-event" className="btn btn-hero">
                <span className="btn-hero-text" style={{ fontWeight: "bold" }}>
                  Lihat Event
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="position-relative">
          <img src={banner_tiga_hero} />
          <div className="text-box">
            <span className="title-sub">
              selamat datang di
              <br />
            </span>
            <span className="title-hero">myarchery</span>
            <div className="content">
              <p>Temukan dan Ikuti berbagai macam Event Panahan di MyArchery</p>
              <a href="#list-event" className="btn btn-hero">
                <span className="btn-hero-text" style={{ fontWeight: "bold" }}>
                  Lihat Event
                </span>
              </a>
            </div>
          </div>
        </div>
      </Carousel>
      <div className="content-landing mt-0" id="list-event">
        <Container fluid>
          <div className="py-5 px-3">
            <Row>
              <Col md={8} sm={12}>
                <Card>
                  {!loading ? (
                    screenLoading()
                  ) : (
                    <>
                      <div className="img-responsive-event-one">
                        <img
                          src={dataEvent[numberEventOne]?.poster}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <CardBody className="card-responsive-event-one">
                        <div>
                          <span className="tag px-3 py-1">
                            {dataEvent[numberEventOne]?.eventCompetition}
                          </span>
                          <h3 className="primary-color mt-2">
                            {dataEvent[numberEventOne]?.eventName}
                          </h3>
                          <div className="mt-3">
                            <span className="bx bx-map"></span>
                            <span className="ms-1">{dataEvent[numberEventOne]?.location}</span>
                          </div>
                          <div>
                            <span className="bx bx-calendar"></span>
                            <span className="ms-1">{getDateEvent(numberEventOne)}</span>
                          </div>
                          <div className="mt-3">
                            <div
                              className="line-clamp mb-3"
                              dangerouslySetInnerHTML={{
                                __html: dataEvent[numberEventOne]?.description,
                              }}
                            ></div>
                            {/* <p >{dataEvent[0]?.description}</p> */}
                          </div>
                          <a href={dataEvent[numberEventOne]?.eventUrl}>
                            <Button color="primary" outline>
                              Lihat Detail
                            </Button>
                          </a>
                        </div>
                      </CardBody>
                    </>
                  )}
                </Card>
              </Col>
              <Col md={4} sm={12}>
                <Card>
                  {!loading ? (
                    screenLoading()
                  ) : (
                    <>
                      <div className="img-responsive-event-two">
                        <img
                          src={dataEvent[numberEventTwo]?.poster}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <CardBody className="card-responsive-event-two">
                        <div>
                          <span className="tag-sub px-3 py-1">
                            {dataEvent[numberEventTwo]?.eventCompetition}
                          </span>
                          <h3 className="primary-color mt-2">
                            {dataEvent[numberEventTwo]?.eventName}
                          </h3>
                          <div className="mt-3">
                            <span className="bx bx-map"></span>
                            <span className="ms-1">{dataEvent[numberEventTwo]?.location}</span>
                          </div>
                          <div>
                            <span className="bx bx-calendar"></span>
                            <span className="ms-1">{getDateEvent(numberEventTwo)}</span>
                          </div>
                          <div className="mt-3">
                            <div
                              className="line-clamp mb-3"
                              dangerouslySetInnerHTML={{
                                __html: dataEvent[numberEventTwo]?.description,
                              }}
                            ></div>
                            {/* <p>Latihan Bersama Barebow Karawang.</p> */}
                          </div>
                          <a href={dataEvent[numberEventTwo]?.eventUrl}>
                            <Button color="primary" outline>
                              Lihat Detail
                            </Button>
                          </a>
                        </div>
                      </CardBody>
                    </>
                  )}
                </Card>
                <div className="look-event card-effect">
                  <div className="w-100">
                    <img src={img_target} className="target-landing" />
                  </div>
                  <div className="ases-satu">
                    <img style={{ width: "65%" }} src={ases_satu} />
                  </div>
                  <div className="ases-dua">
                    <img style={{ width: "60%" }} src={ases_dua} />
                  </div>
                  <div className="ases-tiga">
                    <a href="#">
                      <img style={{ width: "60%" }} src={ases_tiga} />
                    </a>
                  </div>
                  <div className="text">
                    <h3 style={{ color: "white" }}>
                      Lihat Event <br />
                      Lainnya
                    </h3>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
        <div>
          <div className="position-relative">
            <img src={banner_dua} style={{ width: "100%" }} />
            <div>
              <div className="text-box-event">
                <span className="title-sub">buat event</span>
                <span className="title-hero">sekarang</span>
                <div className="content">
                  <span>Buat berbagai event panahan dengan pengaturan sistem</span>
                  <br />
                  <span>skoring, pemeringkatan, dan pengaturan dari MyArchery</span>
                </div>
                <div className="btn-position">
                  <Button
                    as="a"
                    href={getWebAdminURL()}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-hero"
                  >
                    <span className="btn-hero-text" style={{ fontWeight: "bold" }}>
                      Ke Organizer
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="py-5 position-relative">
            <img src={banner_tiga} style={{ width: "100%" }} />
            <div>
              <div className="text-box-club">
                <span className="title-sub">jadi bagian</span>
                <span className="title-hero">dari klub</span>
                <div className="content">
                  <span>Berkumpul dan mamantau kegiatan klub secara virtual lebih</span>
                  <br />
                  <span>mudah melalui MyArchery</span>
                </div>
                <div className="d-flex d-md-block justify-content-center">
                  <Link
                    to={`${
                      !isLoggedIn
                        ? "/archer/login?path=/dashboard/clubs/new"
                        : "/dashboard/clubs/new"
                    }`}
                  >
                    <Button
                      color="warning"
                      style={{ backgroundColor: "#FFF", color: "#0D47A1", textAlign: "left" }}
                    >
                      Buat Klub
                    </Button>
                  </Link>
                  <Link
                    to={`${
                      !isLoggedIn
                        ? "/archer/login?path=/dashboard/clubs/join"
                        : "/dashboard/clubs/join"
                    }`}
                  >
                    <Button
                      className="ms-2"
                      color="warning"
                      style={{ backgroundColor: "#0D47A1", textAlign: "left" }}
                    >
                      Gabung Klub
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-5">
          <Container fluid>
            <div className="position-relative">
              <div className="series"></div>
              <Card style={{ width: "80%", margin: "0 auto" }}>
                <CardBody>
                  <div className="d-md-flex m-0">
                    <div style={{ width: "80%" }} className="w-sm-100">
                      <img src={series_satu} style={{ width: "100%" }} />
                    </div>
                    <div className="py-5 px-1">
                      <div>
                        <h3>PERTANDINGAN SERIES</h3>
                        <p>
                          Rangkaian pertandingan panahan sebagai wadah atlet untuk mengumpulkan skor
                          dan menjadi pemain inti dalam pertandingan bertaraf nasional.{" "}
                        </p>
                        <Button style={{ backgroundColor: "#0D47A1" }}>Lihat Series</Button>
                      </div>
                    </div>
                    <div style={{ width: "70%" }} className="w-sm-100">
                      <img src={series_dua} style={{ width: "100%" }} />
                      <img src={series_tiga} style={{ width: "100%" }} />
                      <img src={series_empat} style={{ width: "100%" }} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Container>
        </div>
        <div style={{ backgroundColor: "#fff" }}>
          <Container fluid>
            <div style={{ textAlign: "center" }}>
              <div className="py-5">
                <h3 style={{ color: "#0D47A1", fontSize: "2rem" }}>Tentang Kami</h3>
              </div>
              <div>
                <Row>
                  <CardAbout
                    className="card-effect"
                    src={img_about_satu}
                    title="Banyak Event"
                    content="Menyediakan berbagai informasi mengenai event panahan"
                  />
                  <CardAbout
                    className="card-effect"
                    src={img_about_dua}
                    title="Berbagai Fitur"
                    content="Fitur yang memudahkan peserta dan penyelenggara event"
                  />
                  <CardAbout
                    className="card-effect"
                    src={img_about_tiga}
                    title="Leaderboard"
                    content="Pantau pergerakan skor peserta melalui leaderboard yang diupdate secara Live"
                  />
                  <CardAbout
                    className="card-effect"
                    src={img_about_empat}
                    title="Klub"
                    content="Berkumpul bersama klub secara virtual dan ikuti berbagai event panahan"
                  />
                  <CardAbout
                    className="card-effect"
                    src={img_about_lima}
                    title="Series"
                    content="Event Series untuk menyeleksi peserta dan atlet panahan"
                  />
                  <CardAbout
                    className="card-effect"
                    src={img_about_enam}
                    title="Live Scored"
                    content="Skoring event secara live yang diupdate ke Leaderboard"
                  />
                </Row>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="py-5">
                <h3 style={{ color: "#0D47A1", fontSize: "2rem", fontWeight: "500" }}>
                  Digunakan Oleh
                </h3>
              </div>
              <div>
                <div className="pb-5">
                  <img src={img_usedby_satu} />
                  <img src={img_usedby_dua} />
                  <img src={img_usedby_tiga} />
                  {/* <img src={img_usedby_empat} /> */}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;

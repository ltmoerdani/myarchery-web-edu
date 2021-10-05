import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button
} from "reactstrap";
import { useParams } from "react-router";
import Footer from "layouts/landingpage/Footer";
import { EventsService } from "services";
import { Link } from "react-router-dom";
import { getAuthenticationStore } from "store/slice/authentication";
import { useSelector } from "react-redux";
import ProfileMenuArcher from "components/TopbarDropdown/ProfileMenuArcher";
// import bgauth from "../../../assets/images/myachery/bg-landingpage.jpg"
import logomyarchery from "../../../assets/images/myachery/myachery.png"
import Countdown from "react-countdown";
import "./components/sass/landingpage.scss"
import UserCard from "./components/UserCard";
// import { dummyHtml } from './components/htmldummy'


const LandingPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState({})
  const path = window.location.pathname;
  
  useEffect(async () => {
    const { data, success } = await EventsService.getEventBySlug({ slug });
    if (success) {
      setEvent(data);
    }
  }, []);

  // let eventStartDate = new Date(event.eventStartDatetime)
  // let eventEndDate = new Date(event.eventEndDatetime)
  // let regStartDate = new Date(event.registrationStartDatetime)
  // let regEndDate = new Date(event.registrationEndDatetime)

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>;
    } else {
      // Render a countdown
      return (
        <>
          <div className="coming-box">
            {days}
            <span>Days</span>
          </div>
          <div className="coming-box">
            {hours}
            <span>Hours</span>
          </div>
          <div className="coming-box">
            {minutes}
            <span>Minutes</span>
          </div>
          <div className="coming-box">
            {seconds}
            <span>Seconds</span>
          </div>
        </>
      );
    }
  };

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // console.log(windowDimensions)
  let { isLoggedIn } = useSelector(getAuthenticationStore);
  console.log(isLoggedIn)


  return (
    <React.Fragment>
      <MetaTags>
        <title>{event.eventName}</title>
      </MetaTags>
      {/* import navbar */}
        <div className="px-4 py-1 sticky-top bg-light d-flex justify-content-between">
          {/* <Row>
            <Col md={6}> */}
              <Link to="/archer/dashboard">
              <div>
                <img src={logomyarchery} width="91" />
              </div>
              </Link>
            {/* </Col>
            <Col md={6}> */}
              { isLoggedIn ? (
                <div>
                  <ProfileMenuArcher color="black" />
                </div>
              ) : (
                <Link style={{padding:"20px"}} to={"/archer/login?path="+path}>
                <Button className="float-end" color="outline-dark">Masuk</Button>
              </Link>
                )
              }
            {/* </Col>
          </Row> */}
        </div>
        <Container>
            <div>
                <img className="w-100 h-landing" src={event.poster} />
            </div>
            <div>
              <Row className="mt-4">
              <Col md={4} sm={12} className={windowDimensions.width <= 767 ? "d-block" : "d-none"}>
                <Card className="overflow-hidden mb-0 mt-5 mt-lg-0">
                <CardHeader className="text-center">
                  <h5 className="mb-0">Waktu Acara</h5>
                </CardHeader>
                <CardBody>
                  <div className="text-center">
                    <div className="mt-4">
                      <div className="counter-number ico-countdown">
                        <Countdown date={event.eventEndDatetime != undefined ? event.eventEndDatetime.replace(/-/g, "/") : "2021/12/12"} renderer={renderer} />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="button-items mt-4">
                  <a  target="_blank" rel="noreferrer" href={`/event/register/process/${slug}`} className="btn btn-success me-1 w-100">
                    DAFTAR EVENT
                  </a>
                </div>
                </Col>
                <Col md={8} sm={12}>
                <div>
                  <div>
                    <div className="clearfix mt-4">
                      <div dangerouslySetInnerHTML={{__html: event.description}} />
                      {/* <a target="_blank" rel="noreferrer" href={event?.handbook} download>
                      <Button color="success">Download Technical Handbook</Button>
                      </a> */}
                    </div>
                  </div>
                  {/* Detail data hardcode */}
                </div>
                </Col>
                <Col md={4} sm={12} className={windowDimensions.width > 752 ? "d-block" : "d-none"}>
                <Card className="overflow-hidden mb-0 mt-5 mt-lg-0">
                <CardHeader className="text-center">
                  <h5 className="mb-0">Waktu Acara</h5>
                </CardHeader>
                <CardBody>
                  <div className="text-center">
                    <div className="mt-4">
                      <div className="counter-number ico-countdown">
                        <Countdown date={event.eventEndDatetime != undefined ? event.eventEndDatetime.replace(/-/g, "/") : "2021/12/12"} renderer={renderer} />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="button-items mt-4">
                  <a  target="_blank" rel="noreferrer" href={`/event/register/process/${slug}`} className="btn btn-success me-1 w-100">
                    DAFTAR EVENT
                  </a>
                </div>
                <Card className="bg-secondary bg-opacity-25 mt-2">
                  <CardBody>
                    <p>Temukan dan daftarkan kebih banyak event panahan terbaru di myachery.id</p>
                    <a className="text-success float-end">Ke myachery.id</a>
                  </CardBody>
                </Card>
                <Card className="mt-4">
                  <CardHeader>
                    <div className="text-center">
                      Live Score (23/09/2021)
                    </div>
                    <div>
                      <h4 className="text-primary">U-12 RECURVE INDIVIDU</h4>
                    </div>
                  </CardHeader>
                  <CardBody>
                      <UserCard pos={1} />
                      <UserCard pos={2} />
                      <UserCard pos={3} />
                  </CardBody>
                </Card>
                <div className="button-items mt-4">
                  <a  target="_blank" rel="noreferrer" href={`/display/score`} className="btn btn-success me-1 w-100">
                    LIHAT SCORE
                  </a>
                </div>
                </Col>
              </Row>
            </div>
        </Container>
      <Footer />
    </React.Fragment>
  );
};

export default LandingPage;

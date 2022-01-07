import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { EventsService } from "services";
import { getAuthenticationStore } from "store/slice/authentication";
import { useSelector } from "react-redux";
import Countdown from "react-countdown";
import "./components/sass/landingpage.scss"


const LandingPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState({})
  
  useEffect(async () => {
    const { data, success } = await EventsService.getEventBySlug({ slug });
    if (success) {
      setEvent(data);
    }
  }, []);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>You are good to go!</span>;
    } else {
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

  let { isLoggedIn } = useSelector(getAuthenticationStore);
  console.log(isLoggedIn)



  return (
    <React.Fragment>
      <MetaTags>
        <title>{event.eventName}</title>
      </MetaTags>
        <Container>
            <div>
                <img className="w-100 h-landing" src={event?.poster} />
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
                <div className="button-items mt-4">
                  <a  target="_blank" rel="noreferrer" href={`/display/score/${slug}`} className="btn btn-warning me-1 w-100">
                    LIVE SCORING
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
                <div className="button-items mt-4">
                  <a  target="_blank" rel="noreferrer" href={`/display/score/${slug}`} className="btn btn-warning me-1 w-100">
                    LIVE SCORING
                  </a>
                </div>
                </Col>
              </Row>
            </div>
        </Container>
    </React.Fragment>
  );
};

export default LandingPage;

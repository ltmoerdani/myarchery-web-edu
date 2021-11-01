import React from 'react'
import { Button, Container, Row, Col} from 'reactstrap'
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom"
import ProfileMenuArcher from "components/TopbarDropdown/ProfileMenuArcher";
import logomyarchery from "../../../assets/images/myachery/myachery.png"
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";
import Footer from "layouts/landingpage/Footer";
import EventCard from './components/EventCard';
import './components/sass/header.scss'


function Home() {
    const path = window.location.pathname;


    let { isLoggedIn } = useSelector(getAuthenticationStore);
    return (
        <React.Fragment>
            <MetaTags>
            <title>MyAcher</title>
            </MetaTags>
            <div className="img-background">
            <div className="px-4 py-1 sticky-top d-flex justify-content-between">
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
                  <div>
                    <Link style={{padding:"20px"}} to={"/archer/login?path="+path}>
                    <Button className="float-end" color="outline-dark">Masuk</Button>
                </Link>
                    <Link>
                        <Button className="me-2" color='primary'>Daftar</Button>
                    </Link>
                </div>
                )
              }
            {/* </Col>
          </Row> */}
        </div>
        <div className="px-3">
            <Row>
                <Col md={6} sm={12}>
                    <div style={{height: '75vh'}} className="ps-5 d-flex align-items-center">
                        <div>
                            <h1>Temukan dan Ikuti <br />berbagai Event Panahan <br />di MyArchery</h1>
                            <a href="#event-list">
                                <Button className="mt-2" color="primary">Lihat Event</Button>
                            </a>

                        </div>
                    </div>
                </Col>
                <Col md={6} sm={12}></Col>
            </Row>
        </div>
            </div>
          <Container>
              <div  className="mt-4" id="event-list">
                  <h1>Event saat ini</h1>
              </div>
              <Row>
                <Col md={4} sm={12}>
                    <EventCard />
                </Col>
                <Col md={4} sm={12}>
                    <EventCard />
                </Col>
                <Col md={4} sm={12}>
                    <EventCard />
                </Col>
              </Row>
          </Container>
          <Footer />
        </React.Fragment>
    )
}

export default Home

import React from 'react'
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom"
import { Button, Container, Row, Col } from "reactstrap"
import ProfileMenuArcher from "components/TopbarDropdown/ProfileMenuArcher";
import logomyarchery from "../../../assets/images/myachery/myachery.png"
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";
import ListEliminasit from './components/ListEliminasit';
// import TableEliminasi from './components/TableEliminasi';

function DisplayEliminasi() {
    // const [eventDetail, setEventDetail] = useState({});

    let { isLoggedIn } = useSelector(getAuthenticationStore);
    const path = window.location.pathname;
    return (
        <React.Fragment>
            <MetaTags>
            {/* <title>{eventDetail.eventName}</title> */}
            <title>MyArchery | Display - Eliminasi</title>
            </MetaTags>
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
        <Container>
        <div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <span className="header-detail pt-1 pe-2"></span>
                        <span>
                        Live Score
                        </span>
                        <span className="ms-2">
                            Babak Eliminasi
                        </span>
                        <span className="ms-2">
                            {/* <span>Last Update: 23 September 2021 | 13.00 WIB</span> */}
                        </span>
                    </div>
                        <div>
                            {/* <span className="float-end">Lihat Jadwal Lengkap<a className="text-success ms-1">ke myachery.id/TheHuB</a></span> */}
                        </div>
                    </div>
            </div>
            <div className="text-center">
                <h1 className="text-primary py-4">The Hub Scoring - 2021</h1>
            </div>
            <hr />
            <div className="mt-4">
            <Row>
                    <Col md={1}>
                        <div>Regu</div>
                    </Col>
                    <Col md={1}>
                        <div>Bantalan</div>
                    </Col>
                    <Col md={4}>
                        <div>Peserta 1</div>
                    </Col>
                    <Col md={2}></Col>
                    <Col md={4}>
                        <div>Peserta 2</div>
                    </Col>
                </Row>
                <ListEliminasit />                
                <ListEliminasit />                
                <ListEliminasit />                
                <ListEliminasit />                
            </div>
        </Container>
        </React.Fragment>
    )
}

export default DisplayEliminasi

import React from 'react'
import { Button, Container, Row, Col, Card, CardBody} from 'reactstrap'
import MetaTags from "react-meta-tags";
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from 'react-responsive-carousel'
import CardAbout from './components/CardAbout';
import {Link} from 'react-router-dom'

import banner_satu from '../../../assets/images/myachery/Banner 2(1).svg'
import img_content from '../../../assets/images/myachery/content-landing-1-2.svg'
import img_target from '../../../assets/images/myachery/target-landing.svg'
// import img_content_two from '../../../assets/images/myachery/content-landing-2-1.svg'
import ases_satu from "../../../assets/images/myachery/ases-satu.svg"
import ases_dua from "../../../assets/images/myachery/ases-dua.svg"
import ases_tiga from "../../../assets/images/myachery/ases-tiga.svg"
import banner_dua from "../../../assets/images/myachery/bANNER2 1.svg"
import banner_tiga from "../../../assets/images/myachery/bANNER3a 1.svg"
import series_satu from "../../../assets/images/myachery/image 6.svg"
import series_dua from "../../../assets/images/myachery/image 4.svg"
import series_tiga from "../../../assets/images/myachery/image 5.svg"
import series_empat from "../../../assets/images/myachery/image 7.svg"
import img_about_satu from "../../../assets/images/myachery/image 25.svg"
import img_about_dua from "../../../assets/images/myachery/image 32.svg"
import img_about_tiga from "../../../assets/images/myachery/image 31.svg"
import img_about_empat from "../../../assets/images/myachery/image 29.svg"
import img_about_lima from "../../../assets/images/myachery/image 30.svg"
import img_about_enam from "../../../assets/images/myachery/image 28.svg"
import img_usedby_satu from "../../../assets/images/myachery/image 20.svg"
import img_usedby_dua from "../../../assets/images/myachery/image 19.svg"
import img_usedby_tiga from "../../../assets/images/myachery/image 18.svg"
import kerawang from "../../../assets/images/myachery/kerawang.svg"

import './components/sass/header.scss'
//TODO: Clrea all the comment before commit please

function Home() {
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
                    <div className='position-relative'>
                        <img src={banner_satu} />
                        <div className='text-box'>
                            <span className='title-sub'>selemat datang di<br/></span>
                            <span className='title-hero'>myachery</span>
                            <div className='content'>
                                <p>Temukan dan Ikuti berbagai macam Event Panahan di MyArchery</p>
                                <Button color='warning' style={{backgroundColor: "#ffb420"}}>Lihat Event</Button>
                            </div>
                        </div>
                    </div>
                    <div className='position-relative'>
                        <img src={banner_satu} />
                        <div className='text-box'>
                            <span className='title-sub'>selamat datang di<br/></span>
                            <span className='title-hero'>myachery</span>
                            <div className='content'>
                                <p>Temukan dan Ikuti berbagai macam Event Panahan di MyArchery</p>
                                <Button color='warning' style={{backgroundColor: "#ffb420"}}>Lihat Event</Button>
                            </div>
                        </div>
                    </div>
                    <div className='position-relative'>
                        <img src={banner_satu} />
                        <div className='text-box'>
                            <span className='title-sub'>selamat datang di<br/></span>
                            <span className='title-hero'>myachery</span>
                            <div className='content'>
                                <p>Temukan dan Ikuti berbagai macam Event Panahan di MyArchery</p>
                                <Button color='warning' style={{backgroundColor: "#ffb420"}}>Lihat Event</Button>
                            </div>
                        </div>
                    </div>
                    </Carousel>
            <div className='content-landing mt-0'>
            <Container fluid>
                        <div className='py-5 px-3'>
                <Row>
                    <Col md={8} sm={12}>
                            <Card>
                                    <div className='w-100'>
                                        <img src={img_content} style={{width: '100%'}} />
                                    </div>
                                <CardBody>
                                    <div>
                                        <span className='tag px-3 py-1'>Games</span>
                                        <h3 className='primary-color mt-2'>The Hub Scoring - 2021</h3>
                                        <div className='mt-2'>
                                            <span className='bx bx-map'></span>
                                            <span className='ms-1'>Cibubur</span>
                                        </div>
                                        <div>
                                            <span className='bx bx-calendar'></span>
                                            <span className='ms-1'>01 Februari 2021 - 28 Februari 2021</span>
                                        </div>
                                        <div className='mt-2'>
                                            <p>Kegiatan scoring untuk kembali menumbuhkan semangat berlatih panahan serta ajang silaturahmi secara langsung sesuai dengan protocol Kesehatan saat ini.</p>
                                        </div>
                                        <Link to="/event/pro-archery/1631782893-the-hub-scoring-2021">
                                            <Button color='primary' outline>Lihat Detail</Button>
                                        </Link>
                                    </div>
                                </CardBody>
                            </Card>
                    </Col>
                    <Col md={4} sm={12}>
                    <Card>
                                    <div className='w-100'>
                                        <img src={kerawang} style={{width: '100%'}} />
                                    </div>
                                <CardBody>
                                    <div>
                                        <span className='tag-sub px-3 py-1'>Barebow Karawang</span>
                                        <h3 className='primary-color mt-2'>Latihan Bersama Barebow Karawang</h3>
                                        <div className='mt-2'>
                                            <span className='bx bx-map'></span>
                                            <span className='ms-1'>Masjid Al-Ghamar Karawang</span>
                                        </div>
                                        <div>
                                            <span className='bx bx-calendar'></span>
                                            <span className='ms-1'>13 November 2021 - 13 November 2021</span>
                                        </div>
                                        <div className='mt-2'>
                                            <p>Latihan Bersama Barebow Karawang.</p>
                                        </div>
                                        <Link to="/event/barebow-karawang/1636560432-latihan-bersama-barebow-karawang">
                                            <Button color='primary' outline>Lihat Detail</Button>
                                        </Link>
                                    </div>
                                </CardBody>
                            </Card>
                        <div className='look-event card-effect'>
                            <div className='w-100'>
                                <img  src={img_target} style={{width: '30%'}} />
                            </div>
                                <div className='ases-satu'>
                                    <img style={{width: '65%'}} src={ases_satu} />
                                </div>
                                <div className='ases-dua'>
                                    <img style={{width: '60%'}} src={ases_dua} />
                                </div>
                                <div className='ases-tiga'>
                                    <a href='#'>
                                        <img style={{width: '60%'}} src={ases_tiga} />
                                    </a>
                                </div>
                            <div className='text'>
                                <h3 style={{color: 'white'}}>Lihat Event <br />Lainnya</h3>
                            </div>
                        </div>
                    </Col>
                </Row>
                </div>
                
            </Container>
            <div>
                <div className='position-relative'>
                    <img src={banner_dua} style={{width: '100%'}} />
                    <div>
                    <div className='text-box-event'>
                    <span className='title-sub'>buat event</span>
                    <span className='title-hero'>sekarang</span>
                        <div className='content'>
                            <span>Buat berbagai event panahan dengan pengaturan sistem</span><br />
                            <span>skoring, pemeringkatan, dan pengaturan dari MyArchery</span>
                        </div>
                        <Button color='warning' style={{backgroundColor: "#ffb420"}}>Lihat Event</Button>
                    </div>
                    </div>
                    </div>
                </div>  

            <div>
                <div className='py-5 position-relative'>
                    <img src={banner_tiga} style={{width: '100%'}} />
                    <div>
                    <div className='text-box-club'>
                    <span className='title-sub'>jadi bagian</span>
                    <span className='title-hero'>dari klub</span>
                        <div className='content'>
                            <span>Berkumpul dan mamantau kegiatan klub secara virtual lebih</span><br />
                            <span>mudah melalui MyArchery</span>
                        </div>
                        <div className='d-flex d-md-block justify-content-center'>
                        <Button color='warning' style={{backgroundColor: "#FFF", color: '#0D47A1', textAlign: 'left' }}>Buat Klub</Button>
                        <Button className='ms-2' color='warning' style={{backgroundColor: "#0D47A1", textAlign: 'left'}}>Gabung Klub</Button>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
                <div className='pb-5'>
                    <Container fluid>
                        <div className='position-relative'>
                        <div className='series'></div>
                        <Card style={{width: '80%', margin: '0 auto'}}>
                            <CardBody>
                                <div className='d-md-flex m-0'>
                                    <div style={{width: '80%'}} className='w-sm-100'>
                                        <img src={series_satu} style={{width: '100%'}} />
                                    </div>
                                    <div className='py-5 px-1'>
                                        <div>
                                            <h3>PERTANDINGAN SERIES</h3>
                                            <p>Rangkaian pertandingan panahan sebagai wadah atlet untuk mengumpulkan skor dan menjadi pemain inti dalam pertandingan bertaraf nasional. </p>
                                            <Button style={{backgroundColor: "#0D47A1"}}>Lihat Series</Button>
                                        </div>
                                    </div>
                                    <div style={{width: '70%'}} className='w-sm-100'>
                                            <img src={series_dua} style={{width: '100%'}} />
                                            <img src={series_tiga} style={{width: '100%'}}/>
                                            <img src={series_empat} style={{width: '100%'}}/>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        </div>
                    </Container>
                </div>    
                    <div style={{backgroundColor: '#fff'}}>
                    <Container fluid>
                            <div style={{textAlign: 'center'}}>
                                <div className='py-5'>
                                    <h3 style={{color: '#0D47A1', fontSize: '2rem'}}>Tentang Kami</h3>
                                </div>
                                <div>
                                    <Row >
                                        <CardAbout className="card-effect" src={img_about_satu} 
                                        title="Banyak Event" 
                                        content="Menyediakan berbagai informasi mengenai event panahan" />
                                        <CardAbout className="card-effect" src={img_about_dua} 
                                        title="Berbagai Fitur"
                                        content="Fitur yang memudahkan peserta dan penyelenggara event"
                                        />
                                        <CardAbout className="card-effect" src={img_about_tiga} 
                                        title="Leaderboard"
                                        content="Pantau pergerakan skor peserta melalui leaderboard yang diupdate secara Live"
                                        />  
                                        <CardAbout className="card-effect" src={img_about_empat} 
                                        title="Klub"
                                        content="Berkumpul bersama klub secara virtual dan ikuti berbagai event panahan"
                                        />  
                                        <CardAbout className="card-effect" src={img_about_lima}
                                        title="Series"
                                        content="Event Series untuk menyeleksi peserta dan atlet panahan"
                                        />  
                                        <CardAbout className="card-effect" src={img_about_enam} 
                                        title="Live Scored"
                                        content="Skoring event secara live yang diupdate ke Leaderboard" 
                                        />  
                                    </Row>
                                </div>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <div className='py-5'>
                                    <h3 style={{color: '#0D47A1', fontSize: '2rem', fontWeight: '500'}}>Digunakan Oleh</h3>
                                </div>
                                <div>
                                    <div className='pb-5'>
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
    )
}

export default Home

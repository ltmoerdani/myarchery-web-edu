import React, { useState } from 'react'
import {Card, CardBody, Row, Col, Button, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap'
import eventImg from '../../../../assets/images/myachery/dashboard-1.png'

function EventCard() {
    const [menu, setMenu] = useState(false)
    return (
        <div>
            <Card>
                <CardBody>
                    <div>
                        <div style={{position: 'relative'}}>
                                    <div style={{position: 'absolute', left: '10px', top: '10px'}}>
                                        <Button color="light">Gratis</Button>
                                    </div>
                                    <div style={{position: 'absolute', right: '10px', top: '10px'}}>
                                    <Dropdown
                                    isOpen={menu}
                                    toggle={() => setMenu(!menu)}
                                >
                                    <DropdownToggle tag="span">
                                        <Button color="light" className="bx bx-share-alt rounded-circle"></Button>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end">
                                        <DropdownItem onClick={() => console.log("COPY LINK")}>
                                            {" "}
                                            <span>Salin Link Tautan</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                        {/* <Button className="bx bx-share-alt rounded-circle" color="light"></Button> */}
                                    </div>
                            <img src={eventImg} width="100%" />
                        </div>
                        <div className="mt-3">
                            <Row>
                                <Col md={2} >
                                    <div className="text-md-center">
                                        <div>SEP</div>
                                        <div className="text-primary">28</div>
                                    </div>
                                </Col>
                                <Col md={10}>
                                    <div className="fw-bold">
                                        Jakarta Archery 2021
                                    </div>
                                    <p>Jl. Pintu Satu Senayan, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus ibukota Jakarta</p>
                                </Col>
                            </Row>
                        </div>
                        <Button color="primary" className="w-100">Selengkapnya</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default EventCard

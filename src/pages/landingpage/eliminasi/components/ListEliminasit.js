import React from 'react'
import { Row, Col } from "reactstrap"
import user1 from "../../../../assets/images/users/avatar-man.png"

function ListEliminasit() {
    return (
        <div>
                <Row>
                    <Col md={1}>
                        <div>A</div>
                    </Col>
                    <Col md={1}>
                        <div>Bantalan 1</div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex align-items-center">
                                <div className="me-2">
                                <img
                                    className="rounded-circle header-profile-user"
                                    src={user1}
                                    alt="Header Avatar"
                                />
                                </div>
                            <div>
                                <div>
                                ASEP
                                </div>
                                <small>FAST</small>
                            </div>
                            <div>
                                <span className="bg-primary rounded-pill text-white ms-2">Peringkat 1</span>
                            </div>
                        </div>
                    </Col>
                    <Col md={2}>
                        VS
                    </Col>
                    <Col md={4}>
                    <div className="d-flex align-items-center">
                    <div className="me-2">
                                <img
                                    className="rounded-circle header-profile-user"
                                    src={user1}
                                    alt="Header Avatar"
                                />
                                </div>
                            <div>
                                <div>
                                David McHenry
                                </div>
                                <small>INDIV</small>
                            </div>
                            <div>
                                <span className="bg-primary rounded-pill text-white ms-2">Peringkat 1</span>
                            </div>
                        </div>
                    </Col>
                </Row>
        </div>
    )
}

export default ListEliminasit

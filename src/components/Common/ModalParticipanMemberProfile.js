import React from "react";
import Avatar from "../../assets/images/users/avatar-man.png"
import { Row, Col, ModalBody, Button, Modal } from "reactstrap"

const ModalParticipantMemberProfile = props => {
  const { participant, toggle, isOpen } = props;

  return (
    <Modal isOpen={isOpen} fade={false} toggle={toggle}>
      <ModalBody>
            <Row>
              <Col md={2}>
                <img
                    src={Avatar}
                    alt=""
                    className="avatar-md rounded-circle img-thumbnail"
                    style={{height: 'auto'}}
                />
              </Col>
              <Col md={12}>
                <h4>
                  {participant?.member?.name}
                </h4>
                <span>{participant?.club}</span>
              </Col>
              <Col md={6}>
                <div>
                  <h6>{participant?.phoneNumber}</h6>
                </div>
                <div>
                  <h6>Email</h6>
                  <span>{participant?.email}</span>
                </div>
              </Col>
              <Col md={6}>
                <div>
                  <h6>Usia</h6>
                <span>{participant?.member?.age}</span>
                </div>
              </Col>
              <Col md={12}>
              <br /></br>
              <br /></br>
              <div>
              {participant && participant.schedule && participant.schedule.length > 0 ?
              <div>
              <h5>Jadwal Kualifikasi:</h5>
                {participant.schedule.map((s,i) => {
                  return <p key={i}>
                    <strong>{"sesi "+(i+1)}</strong> {s.session.day+" "+s.dateLabel+" "+s.session.startTime+"-"+s.session.endTime}
                  </p>
                })}
              </div>: null}
              </div>
              </Col>
            </Row>
            <div className="float-end">
              <Button color="secondary" onClick={toggle}>Ok</Button>
            </div>
          </ModalBody>
        </Modal>
  );
};


export default ModalParticipantMemberProfile;

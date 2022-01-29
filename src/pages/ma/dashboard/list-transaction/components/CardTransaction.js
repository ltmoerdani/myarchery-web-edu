import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

function CardTransaction({ eventName, poster, location, eventType, eventStart, eventEnd, idEvent }) {
  const startEvent = new Date(eventStart)
  const endEvent = new Date(eventEnd)

  const months = [
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

  const getDate = (date) => {
      return `${date?.getDate()} - ${months[date?.getMonth()]} - ${date?.getFullYear()}`
  }

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <Row>
            <Col md={4}>
              <div style={{ width: "100%", height: "145px" }}>
                <img src={poster} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            </Col>
            <Col md={4}>
              <div>
                <h5 style={{ color: "#0D47A1" }}>{eventName}</h5>
                <span
                  style={{ backgroundColor: "#FFCD6A", borderRadius: "20px", padding: "4px 8px" }}
                >
                  {eventType}
                </span>
              </div>
              <div className="mt-3">
                <span>{location}</span>
                <br />
                <span>
                  {getDate(startEvent)} - {getDate(endEvent)}
                </span>
              </div>
            </Col>
            <Col md={4}>
              <div className="float-end">
                <Link>
                  <button
                    className="btn me-2"
                    style={{ backgroundColor: "#FFF", color: "#0D47A1", borderColor: "#0D47A1" }}
                  >
                    Leader Board
                  </button>
                </Link>
                <Link to={`/dashboard/transactions/${idEvent}`}>
                  <button className="btn" style={{ backgroundColor: "#0D47A1", color: "#FFF" }}>
                    Lihat Detail
                  </button>
                </Link>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default CardTransaction;

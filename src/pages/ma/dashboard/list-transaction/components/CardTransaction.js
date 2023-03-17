import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

import { parseISO, format } from "date-fns";
import { id } from "date-fns/locale";

function CardTransaction({
  orderId,
  eventName,
  poster,
  location,
  eventType,
  eventStart,
  eventEnd,
}) {
  const [eventStartDateFormat, setEventStartDateFormat] = React.useState(null);
  const [eventEndDateFormat, setEvenEndDateFormat] = React.useState(null);

  React.useEffect(() => {
    if (eventStart) {
      setEventStartDateFormat(formatFullDate(eventStart));
    } else {
      setEventStartDateFormat("N/A");
    }

    if (eventEnd) {
      setEvenEndDateFormat(formatFullDate(eventEnd));
    } else {
      setEvenEndDateFormat("N/A");
    }
  }, [eventStart, eventEnd]);

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <Row>
            <Col md={4}>
              <div style={{ width: "100%", height: "145px" }}>
                <img
                  src={poster}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            </Col>
            <Col md={4}>
              <div>
                <h5 style={{ color: "#0D47A1" }}>{eventName}</h5>
                <span
                  style={{
                    backgroundColor: "#FFCD6A",
                    borderRadius: "20px",
                    padding: "4px 8px",
                  }}
                >
                  {eventType}
                </span>
              </div>
              <div className="mt-3">
                <span>{location}</span>
                <br />
                <span>
                  {eventStartDateFormat} - {eventEndDateFormat}
                </span>
              </div>
            </Col>
            <Col md={4}>
              <div className="float-end">
                <button
                  className="btn me-2"
                  style={{
                    backgroundColor: "#FFF",
                    color: "#0D47A1",
                    borderColor: "#0D47A1",
                  }}
                  disabled
                >
                  Leader Board
                </button>
                <Link to={`/dashboard/transactions/${orderId}`}>
                  <button
                    className="btn"
                    style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                  >
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

// util
function formatFullDate(date) {
  const dateObject = typeof date === "string" ? parseISO(date) : date;
  return format(dateObject, "d MMMM yyyy", { locale: id });
}

export default CardTransaction;

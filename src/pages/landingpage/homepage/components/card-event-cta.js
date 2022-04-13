import * as React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";

import { Row, Col } from "reactstrap";
import Countdown from "react-countdown";
import CurrencyFormat from "react-currency-format";
import { Button, ButtonBlue } from "components/ma";

import { isAfter, parseISO } from "date-fns";

function CardEventCTA({ eventDetail }) {
  const { isLoggedIn } = useSelector(getAuthenticationStore);

  const registerEventEnd = eventDetail.registrationEndDatetime
    ? parseISO(eventDetail.registrationEndDatetime)
    : "";

  const isRegistrationClosed = registerEventEnd ? isAfter(new Date(), registerEventEnd) : true;

  /* ================================================================================= */

  let feeType = [];
  feeType = eventDetail?.eventPrice ? Object.keys(eventDetail?.eventPrice) : [];

  /* ================================================================================= */

  let arrayFee = [];
  let dateEarlyBird = [];

  arrayFee = eventDetail?.eventPrice ? Object.values(eventDetail?.eventPrice) : [];

  for (let i = 0; i < arrayFee.length; i++) {
    dateEarlyBird.push(arrayFee[i].endDateEarlyBird);
  }

  /* ================================================================================= */

  return (
    <div className="event-countdown-box">
      {eventDetail && (
        <React.Fragment>
          <div style={{ textAlign: "start" }}>
            <h5>Biaya Pendaftaran</h5>

            <Row className="py-3">
              {arrayFee?.map((data, index) => {
                return (
                  <Col
                    key={index}
                    md={4}
                    className="py-2 px-2"
                    style={{
                      border: "1px solid #FFB420",
                      textAlign: "center",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      className="px-3 py-1"
                      style={{
                        backgroundColor: "#FFB420",
                        color: "#495057",
                        borderRadius: "5px",
                        textTransform: "capitalize",
                      }}
                    >
                      {feeType[index]}
                    </div>

                    <div className="mt-2 col-4 w-100">
                      {data.isEarlyBird ? (
                        <div style={{ textAlign: "center" }}>
                          <CurrencyFormat
                            style={{ textDecoration: "line-through" }}
                            className="mx-2"
                            displayType={"text"}
                            value={data.price ? Number(data.price) : 0}
                            prefix="Rp"
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={0}
                            fixedDecimalScale
                          />

                          <CurrencyFormat
                            displayType={"text"}
                            value={data.earlyBird ? Number(data.earlyBird) : 0}
                            prefix="Rp"
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={0}
                            fixedDecimalScale
                          />
                        </div>
                      ) : (
                        <div>
                          <CurrencyFormat
                            displayType={"text"}
                            value={data.price ? Number(data.price) : 0}
                            prefix="Rp"
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={0}
                            fixedDecimalScale
                          />
                        </div>
                      )}
                    </div>
                  </Col>
                );
              })}
            </Row>

            <div className="pb-3">
              <span>Segera daftarkan dirimu dan timmu pada kompetisi {eventDetail?.eventName}</span>
            </div>
          </div>

          <Countdown date={registerEventEnd} renderer={HandlerCountDown} />
        </React.Fragment>
      )}

      <div className="pb-2">
        {isRegistrationClosed ? (
          <Button disabled style={{ width: "100%", fontWeight: "600", fontSize: "16px" }}>
            Tutup
          </Button>
        ) : (
          <ButtonBlue
            as={Link}
            to={`${
              !isLoggedIn
                ? `/archer/login?path=/event-registration/${eventDetail?.eventSlug}`
                : `/event-registration/${eventDetail?.eventSlug}`
            }`}
            style={{ width: "100%", fontWeight: "600", fontSize: "16px" }}
          >
            Daftar Event
          </ButtonBlue>
        )}
      </div>
    </div>
  );
}

function HandlerCountDown({ days, hours, minutes, seconds, completed }) {
  if (completed) {
    return (
      <div>
        <span>Berakhir</span>
      </div>
    );
  }

  return (
    <div className="countdown-timer">
      <div className="countdown-item">
        {days}
        <span className="timer-unit">Hari</span>
      </div>

      <div className="countdown-item">
        {hours}
        <span className="timer-unit">Jam</span>
      </div>

      <div className="countdown-item">
        {minutes}
        <span className="timer-unit">Menit</span>
      </div>

      <div className="countdown-item">
        {seconds}
        <span className="timer-unit">Detik</span>
      </div>
    </div>
  );
}

export { CardEventCTA };

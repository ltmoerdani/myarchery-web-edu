import * as React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import Calendar from "components/ma/icons/Calendar";
import MapPin from "components/ma/icons/MapPin";
import Panah from "components/ma/icons/Panah";

const formatDate = (datetimeString) => {
  // YYYY-MM-DD
  const date = datetimeString.split(" ")[0].split("-");
  // DD/MM/YYYY
  return date.reverse().join("/");
};

const InfoDisplayWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  margin-bottom: 0.5rem;

  .info-icon {
    transform: translateY(-2px);
  }
`;

function EventCity({ children, city }) {
  const locationTextLabel = children || city || "Kota tidak tersedia";
  return (
    <InfoDisplayWrapper>
      <span className="info-icon">
        <MapPin />
      </span>
      <span>{locationTextLabel}</span>
    </InfoDisplayWrapper>
  );
}

function EventDateRange({ from, to }) {
  const isDateAvailable = from && to;

  const dateRange = isDateAvailable
    ? `${formatDate(from)} - ${formatDate(to)}`
    : "Tanggal tidak tersedia";

  return (
    <InfoDisplayWrapper>
      <span className="info-icon">
        <Calendar size={16} />
      </span>
      <span>{dateRange}</span>
    </InfoDisplayWrapper>
  );
}

function EventCategory({ category }) {
  return (
    <InfoDisplayWrapper>
      <span className="info-icon">
        <Panah size={16} />
      </span>
      <span>{category || "Ketegori tidak tersedia"}</span>
    </InfoDisplayWrapper>
  );
}

const EventItemCardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 0.25rem 0.5rem rgb(18 38 63 / 2.5%);
  transition: all 0.4s;

  &:hover {
    box-shadow: 0 0.25rem 0.8rem rgb(18 38 63 / 7.5%);
  }

  .event-body {
    overflow-y: hidden;
    flex-grow: 1;
    padding: 1.5rem;
    padding-bottom: 0.5rem;

    .event-icon {
      margin-bottom: 1rem;
    }

    .event-title {
      color: var(--ma-blue);
      font-weight: 600;
      margin-bottom: 1rem;
    }
  }

  .event-footer {
    flex-shrink: 0;
    padding: 1.5rem;
    padding-top: 0;
    text-align: right;

    .event-link::before {
      content: " ";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
`;

function EventItemCard({ event: order }) {
  const { archeryEvent, participant } = order;
  const hrefToEventHome = participant?.id ? `/checkout-event/${participant.id}` : "#";

  return (
    <EventItemCardWrapper>
      <div className="event-body">
        <div className="event-icon">
          <Panah size={28} color="#afafaf" />
        </div>

        <h4 className="event-title">{archeryEvent.eventName}</h4>
        <EventCity city={archeryEvent.city} />
        <EventDateRange from={archeryEvent.eventStartDatetime} to={archeryEvent.eventEndDatetime} />
        <EventCategory category={participant.categoryLabel} />
      </div>

      <div className="event-footer">
        <Link className="event-link" to={hrefToEventHome}>
          <i className="bx bx-right-arrow-alt fs-3" style={{ color: "var(--ma-blue)" }} />
        </Link>
      </div>
    </EventItemCardWrapper>
  );
}

export default EventItemCard;

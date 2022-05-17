import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEventsList } from "../hooks/events-list";

import { SpinnerDotBlock } from "components/ma";

import IconCalendar from "components/ma/icons/mono/calendar";
import IconMapPin from "components/ma/icons/mono/map-pin";

import { datetime } from "utils";

function LatestEvents() {
  const { data: events, isSettled } = useEventsList();

  if (!isSettled) {
    return <SpinnerDotBlock />;
  }

  return (
    <Wrapper>
      <EventsGrid>
        {events.map((event) => {
          const showPoster = Boolean(event.poster);
          return (
            <CardEventItem key={event.id}>
              <CardEventItemHeader>
                <div className="image-container">
                  {showPoster && (
                    <Link to={_parseEventPath(event.eventUrl)}>
                      <img className="event-item-banner-img" src={event.poster} alt="Banner" />
                    </Link>
                  )}
                </div>
              </CardEventItemHeader>

              <CardBodySectionContainer>
                <CardEventItemBody>
                  <div>
                    <Link to={_parseEventPath(event.eventUrl)}>
                      <HeadingEventName>{event.eventName}</HeadingEventName>
                    </Link>
                    <div>Oleh {event.admin?.name}</div>
                  </div>

                  <EventInfoList>
                    <EventInfoItemLabel>
                      <LabelIconWrapper>
                        <IconCalendar />
                      </LabelIconWrapper>
                      <LabelHead>
                        {datetime.formatFullDateLabel(event.eventStartDatetime)} &ndash;{" "}
                        {datetime.formatFullDateLabel(event.eventEndDatetime)}
                      </LabelHead>
                    </EventInfoItemLabel>

                    <EventInfoItemLabel>
                      <LabelIconWrapper>
                        <IconMapPin />
                      </LabelIconWrapper>

                      <div>
                        {Boolean(event.detailCity?.name) && (
                          <LabelHead>{event.detailCity?.name?.toLowerCase()}</LabelHead>
                        )}
                        <div>{event.location}</div>
                      </div>
                    </EventInfoItemLabel>
                  </EventInfoList>
                </CardEventItemBody>
              </CardBodySectionContainer>
            </CardEventItem>
          );
        })}
      </EventsGrid>

      <div>
        <ButtonToEventsPage as={Link} to="/events">
          Lihat semua event
        </ButtonToEventsPage>
      </div>
    </Wrapper>
  );
}

/* ============================== */
// styles

const Wrapper = styled.div`
  > * + * {
    margin-top: 2rem;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 769px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

const CardEventItem = styled.div`
  display: flex;
  flex-direction: column;

  overflow: hidden;
  background-color: #ffffff;
  border: solid 1px var(--ma-gray-100);
  border-radius: 0.25rem;

  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0.25rem 0.5rem rgb(18 38 63 / 7.5%);
    transform: translateY(-1px);
  }
`;

const CardEventItemHeader = styled.div`
  > .image-container {
    position: relative;
    width: 100%;
    padding-top: 42%;
    background-color: var(--ma-gray-600);

    .event-item-banner-img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
`;

const CardBodySectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100%;
  padding: 1.25rem 1rem;
`;

const CardEventItemBody = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const HeadingEventName = styled.h4`
  color: var(--ma-blue);
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const LabelHead = styled.div`
  color: var(--ma-gray-600);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const EventInfoList = styled.div`
  > * + * {
    margin-top: 0.75rem;
  }
`;

const EventInfoItemLabel = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;

  > *:nth-child(1) {
    flex-shrink: 0;
  }

  > *:nth-child(2) {
    flex-grow: 1;
  }
`;

const LabelIconWrapper = styled.div`
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #d8d9e8;
  color: var(--ma-blue);
`;

const ButtonToEventsPage = styled.a`
  display: block;
  padding: 1.25rem 0;
  border-radius: 0.5rem;
  color: var(--ma-blue);
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;

  transition: all 0.15s;

  &:hover {
    color: var(--ma-blue);
    text-decoration: underline !important;
    background-color: #fafafa;
  }
`;

/* ============================== */
// utils

function _parseEventPath(url) {
  if (!url) {
    return url;
  }
  const segments = url.split("/");
  if (!segments[3] || !segments[4] || !segments[5]) {
    return url;
  }
  return `/${segments[3]}/${segments[4]}/${segments[5]}`;
}

export { LatestEvents };

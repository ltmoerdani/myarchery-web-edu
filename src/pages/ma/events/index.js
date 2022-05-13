import * as React from "react";
import { Link } from "react-router-dom";
import { useEventsList } from "./hooks/events-list";
import styled from "styled-components";

import Countdown from "react-countdown";
import { SpinnerDotBlock, ButtonBlue, ButtonOutlineBlue } from "components/ma";

import IconCalendar from "components/ma/icons/mono/calendar";
import IconMapPin from "components/ma/icons/mono/map-pin";

import { datetime } from "utils";

function PageEventsList() {
  const { data: events, isSettled } = useEventsList();

  if (!isSettled) {
    return <SpinnerDotBlock />;
  }

  return (
    <PageWrapper>
      <InnerContentWrapper>
        <LatestEventWrapper>
          <LatestEventBanner>
            {Boolean(events?.[0]) && (
              <img className="event-banner-image" src={events?.[0]?.poster} />
            )}
          </LatestEventBanner>

          <LatestEventCTABar>
            <div>
              <Countdown
                date={datetime.parseServerDatetime(events?.[0]?.registrationEndDatetime)}
                renderer={CustomCountDown}
              />
            </div>

            <LatestEventCTACopywriting>
              Segera daftarkan dirimu dan timmu pada kompetisi {events?.[0]?.eventName}
            </LatestEventCTACopywriting>

            <LatestEventCTAButtonsGroup>
              <ButtonBlue block as={Link} to={_parseEventPath(events?.[0]?.eventUrl)}>
                Daftar Sekarang
              </ButtonBlue>
            </LatestEventCTAButtonsGroup>
          </LatestEventCTABar>
        </LatestEventWrapper>

        <ContentSectionBlock>
          <HeadingAllEventSection>Semua Event</HeadingAllEventSection>
          <HrBlue />
          <PageDescription>
            Rangkaian pertandingan panahan sebagai wadah atlet untuk mengumpulkan skor dan menjadi
            pemain inti dalam pertandingan bertaraf nasional.
          </PageDescription>
        </ContentSectionBlock>

        <ContentSectionBlock>
          <EventsGrid>
            {events.map((event) => {
              const showPoster = Boolean(event.poster);
              return (
                <CardEventItem key={event.id}>
                  <CardEventItemHeader>
                    <div className="image-container">
                      {showPoster && (
                        <img className="event-item-banner-img" src={event.poster} alt="Banner" />
                      )}
                    </div>
                  </CardEventItemHeader>

                  <CardBodySectionContainer>
                    <CardEventItemBody>
                      <div>
                        <HeadingEventName>{event.eventName}</HeadingEventName>
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

                      {Boolean(event.description) && (
                        <EventDescription title={event.description}>
                          {event.description}
                        </EventDescription>
                      )}
                    </CardEventItemBody>

                    <EventCardBottomAction>
                      <ButtonOutlineBlue as={Link} to={_parseEventPath(event.eventUrl)}>
                        Lihat Detail
                      </ButtonOutlineBlue>
                    </EventCardBottomAction>
                  </CardBodySectionContainer>
                </CardEventItem>
              );
            })}
          </EventsGrid>
        </ContentSectionBlock>
      </InnerContentWrapper>
    </PageWrapper>
  );
}

function CustomCountDown({ days, hours, minutes, seconds, completed }) {
  if (completed) {
    return (
      <div>
        <span>Event Berakhir</span>
      </div>
    );
  }

  return (
    <CountdownWrapper>
      <CounterItem>
        <CounterNumber>{days}</CounterNumber>
        <CounterUnit>Hari</CounterUnit>
      </CounterItem>

      <CounterItem>
        <CounterNumber>{hours}</CounterNumber>
        <CounterUnit>Jam</CounterUnit>
      </CounterItem>

      <CounterItem>
        <CounterNumber>{minutes}</CounterNumber>
        <CounterUnit>Menit</CounterUnit>
      </CounterItem>

      <CounterItem>
        <CounterNumber>{seconds}</CounterNumber>
        <CounterUnit>Detik</CounterUnit>
      </CounterItem>
    </CountdownWrapper>
  );
}

/* ============================= */
// styles

const PageWrapper = styled.div`
  margin: 2.5rem 0;
  background-color: #f8f8fa;
  font-family: "Inter";
`;

const InnerContentWrapper = styled.div`
  max-width: 83rem;
  margin: 0 auto;
  background-color: #ffffff;

  @media (min-width: 768px) {
    margin: 0 0.75rem;
  }

  @media (min-width: 1264px) {
    margin: 0 auto;
  }
`;

const ContentSectionBlock = styled.div`
  padding: 2rem;
`;

const LatestEventWrapper = styled.div`
  padding: 0;
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const LatestEventBanner = styled.div`
  position: relative;
  width: 100%;
  padding-top: 42%;
  background-color: var(--ma-gray-600);

  .event-banner-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const LatestEventCTABar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1.75rem;

  margin-left: auto;
  margin-right: auto;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0px -8px 36px 0px rgba(0, 0, 0, 0.17);

  transform: translateY(-2rem);

  @media (min-width: 768px) {
    max-width: 40rem;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    max-width: 73.375rem;
  }
`;

const LatestEventCTACopywriting = styled.div`
  max-width: 27.625rem;

  @media (min-width: 768px) {
    text-align: center;
  }

  @media (min-width: 1024px) {
    text-align: left;
  }
`;

const LatestEventCTAButtonsGroup = styled.div`
  flex-shrink: 0;
  width: 100%;

  @media (min-width: 1024px) {
    width: auto;
  }
`;

const HeadingAllEventSection = styled.h1`
  color: var(--ma-blue);
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
`;

const HrBlue = styled.hr`
  background-color: var(--ma-blue);
`;

const PageDescription = styled.p`
  margin-left: auto;
  margin-right: auto;
  max-width: 1024px;

  color: var(--ma-gray-600);
  font-size: 1.5rem;
  text-align: center;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }
`;

const CardEventItem = styled.div`
  display: flex;
  flex-direction: column;

  background-color: #ffffff;
  border: solid 1px var(--ma-gray-50);
  border-radius: 0.25rem;
  box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 0.25);
`;

const CardEventItemHeader = styled.div`
  padding: 0.5rem;

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
  padding: 1.75rem;
`;

const CardEventItemBody = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const HeadingEventName = styled.h4`
  color: var(--ma-blue);
  font-weight: 600;
`;

const LabelHead = styled.div`
  color: var(--ma-gray-600);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const EventInfoList = styled.div`
  > * + * {
    margin-top: 0.25rem;
  }
`;

const EventInfoItemLabel = styled.div`
  display: flex;
  gap: 0.5rem;
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

const EventDescription = styled.p`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const EventCardBottomAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CountdownWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  text-align: center;
`;

const CounterItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  min-height: 6rem;
  border-radius: 0.25rem;
  border: solid 1px #eff2f7;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    flex-shrink: 0;
  }

  @media (min-width: 520px) {
    min-width: 6.245rem;
  }
`;

const CounterNumber = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--ma-text-black);
  font-size: 1.625rem;
  font-weight: 600;
`;

const CounterUnit = styled.span`
  padding: 0.25rem 0.5rem;
  background-color: #eff2f7;
  font-size: 0.75rem;
  font-weight: 400;
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

export default PageEventsList;

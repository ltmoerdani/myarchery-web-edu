import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useQueueHeavyImageList } from "hooks/queue-heavy-image-list";
import { useEventsList } from "./hooks/events-list";

import Countdown from "react-countdown";
import { SpinnerDotBlock, ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { HeavyImage } from "components/ma/heavy-image";

import IconCalendar from "components/ma/icons/mono/calendar";
import IconMapPin from "components/ma/icons/mono/map-pin";

import { datetime } from "utils";

import logoLight from "assets/images/myachery/myachery.png";
import pro from "assets/images/partners/pro.png";
import monster from "assets/images/partners/monster.png";
import queen from "assets/images/partners/queen.png";

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
                date={datetime.parseServerDatetime(
                  events?.[0]?.registrationEndDatetime
                )}
                renderer={CustomCountDown}
              />
            </div>

            <LatestEventCTACopywriting>
              Segera daftarkan dirimu dan timmu pada kompetisi{" "}
              {events?.[0]?.eventName}
            </LatestEventCTACopywriting>

            <LatestEventCTAButtonsGroup>
              <ButtonBlue
                block
                as={Link}
                to={_parseEventPath(events?.[0]?.eventUrl)}
              >
                Daftar Sekarang
              </ButtonBlue>
            </LatestEventCTAButtonsGroup>
          </LatestEventCTABar>
        </LatestEventWrapper>

        <HeadingSectionBlock>
          <HeadingAllEventSection>Semua Event</HeadingAllEventSection>
          <HrBlue />
          <PageDescription>
            Rangkaian pertandingan panahan sebagai wadah atlet untuk
            mengumpulkan skor dan menjadi pemain inti dalam pertandingan
            bertaraf nasional.
          </PageDescription>
        </HeadingSectionBlock>

        <ContentSectionBlock>
          <EventList events={events} />
        </ContentSectionBlock>
      </InnerContentWrapper>

      <PartnershipContentWrapper>
        <PartnershipHeading>Partner MyArchery</PartnershipHeading>

        <PartnershipDescription>
          Bersama berbagai komunitas, klub, organisasi, dan toko perlengkapan
          panah, MyArchery memastikan kegiatan panahan selalu nyaman dan
          menyenangkan untuk berbagai kalangan.
        </PartnershipDescription>

        <PartnersLogosGrid>
          <div>
            <img src={pro} className="img-fluid" />
          </div>

          <div>
            <img src={monster} className="img-fluid" />
          </div>

          <div>
            <img src={queen} className="img-fluid" />
          </div>
        </PartnersLogosGrid>
      </PartnershipContentWrapper>
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

function EventList({ events }) {
  const { registerQueue, checkIsPending, onLoad, onError } =
    useQueueHeavyImageList();
  return (
    <EventsGrid>
      {events.map((event, index) => {
        const showPoster = Boolean(event.poster);
        return (
          <CardEventItem key={event.id}>
            <CardEventItemHeader>
              <div className="image-container">
                <Link to={_parseEventPath(event.eventUrl)}>
                  {showPoster && (
                    <HeavyImage
                      src={event.poster}
                      onRegisterQueue={() => registerQueue(index)}
                      onLoad={onLoad}
                      onError={onError}
                      isPending={checkIsPending(index)}
                      fallback={
                        <BannerLoadingQueue>memuat...</BannerLoadingQueue>
                      }
                      alt="Banner"
                      className="event-item-banner-img"
                    />
                  )}
                </Link>
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
                      {datetime.formatFullDateLabel(event.eventStartDatetime)}{" "}
                      &ndash;{" "}
                      {datetime.formatFullDateLabel(event.eventEndDatetime)}
                    </LabelHead>
                  </EventInfoItemLabel>

                  <EventInfoItemLabel>
                    <LabelIconWrapper>
                      <IconMapPin />
                    </LabelIconWrapper>

                    <div>
                      {Boolean(event.detailCity?.name) && (
                        <LabelHead>
                          {event.detailCity?.name?.toLowerCase()}
                        </LabelHead>
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
                <ButtonOutlineBlue
                  as={Link}
                  to={_parseEventPath(event.eventUrl)}
                >
                  Lihat Detail
                </ButtonOutlineBlue>
              </EventCardBottomAction>
            </CardBodySectionContainer>
          </CardEventItem>
        );
      })}
    </EventsGrid>
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

const HeadingSectionBlock = styled.div`
  padding: 2rem;
  transform: translateY(2rem);

  @media (min-width: 768px) {
    transform: none;
  }
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

  @media (min-width: 768px) {
    max-width: 40rem;
    transform: translateY(-2rem);
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
  font-size: 2rem;
  font-weight: 800;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const HrBlue = styled.hr`
  background-color: var(--ma-blue);
`;

const PageDescription = styled.p`
  margin-left: auto;
  margin-right: auto;
  max-width: 960px;

  color: var(--ma-gray-600);
  font-size: 1.125rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.375rem;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  }
`;

const CardEventItem = styled.div`
  display: flex;
  flex-direction: column;

  background-color: #ffffff;
  border: solid 1px var(--ma-gray-100);
  border-radius: 0.25rem;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);

  transition: box-shadow 0.125s ease-in-out;

  &:hover {
    box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.05);
  }
`;

const CardEventItemHeader = styled.div`
  padding: 0.5rem;

  > .image-container {
    position: relative;
    width: 100%;
    padding-top: 42%;
    background-color: var(--ma-gray-50);

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
  gap: 1rem;

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

const PartnershipContentWrapper = styled.div`
  max-width: 83rem;
  margin: 5rem auto;
  padding: 0 2rem;

  @media (min-width: 768px) {
    margin-left: 0.75rem;
    margin-right: 0.75rem;
  }

  @media (min-width: 1024px) {
    padding: 0;
    margin-left: auto;
    margin-right: auto;
  }
`;

const PartnershipHeading = styled.h3`
  margin-bottom: 1.5rem;
  color: var(--ma-blue);
  font-size: 2rem;
  font-weight: 800;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PartnershipDescription = styled.p`
  max-width: 55rem;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.125rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const PartnersLogosGrid = styled.div`
  margin-top: 2.75rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const BannerLoadingQueue = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;

  background-image: url(${logoLight});
  background-size: 30%;
  background-repeat: no-repeat;
  background-position: center;

  color: var(--ma-gray-400);
  text-align: center;
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

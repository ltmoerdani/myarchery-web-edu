import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { OrderEventService } from "services";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { ButtonBlue } from "components/ma";
import { BreadcrumbDashboard } from "../components/breadcrumb";

import IconCalendar from "components/ma/icons/mono/calendar";
import IconMapPin from "components/ma/icons/mono/map-pin";

import { parseISO, format } from "date-fns";

function PageEventsHome() {
  const [eventsState, dispatchEventsState] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      status: "idle",
      data: null,
      errors: null,
    }
  );

  const { data: events } = eventsState;
  const isLoadingEvents = eventsState.status === "loading";
  const isErrorEvents = eventsState.status === "error";

  React.useEffect(() => {
    const fetchMyEventsList = async () => {
      dispatchEventsState({ status: "loading", errors: null });
      const result = await OrderEventService.getEventsByAuthUser();
      if (result.success) {
        dispatchEventsState({ status: "success", data: result.data });
      } else {
        dispatchEventsState({ status: "error", errors: result.errors });
      }
    };

    fetchMyEventsList();
  }, []);

  return (
    <PageWrapper>
      <MetaTags>
        <title>Event Saya | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="/dashboard">Event Saya</BreadcrumbDashboard>

        {!events && isLoadingEvents ? (
          <div>Sedang mempersiapkan data event Anda...</div>
        ) : isErrorEvents ? (
          <div>Error mengambil data event Anda.</div>
        ) : !events?.length ? (
          <div>Belum mengikuti event</div>
        ) : (
          <EventsList>
            {events.reverse().map((event) => (
              <EventItem key={event.id}>
                {event.publicInformation.eventBanner ? (
                  <PosterThumb>
                    <img src={event.publicInformation.eventBanner} />
                  </PosterThumb>
                ) : (
                  <PosterThumb></PosterThumb>
                )}

                <ItemContent>
                  <div>
                    <EventNameHeading>{event.publicInformation.eventName}</EventNameHeading>
                  </div>

                  <ItemFooter>
                    <MetaInfo>
                      <InfoLabelWithIcon>
                        <span>
                          <IconMapPin size="20" />
                        </span>
                        <span>{event.publicInformation.eventCity.nameCity}</span>
                      </InfoLabelWithIcon>

                      <InfoLabelWithIcon>
                        <span>
                          <IconCalendar size="20" />
                        </span>
                        <span>
                          {format(parseISO(event.publicInformation.eventStart), "dd/MM/yyyy")}{" "}
                          &ndash; {format(parseISO(event.publicInformation.eventEnd), "dd/MM/yyyy")}
                        </span>
                      </InfoLabelWithIcon>
                    </MetaInfo>

                    <ActionButtons>
                      <ButtonBlue as={Link} to={`/dashboard/events/${event.id}`}>
                        Lihat Event
                      </ButtonBlue>
                    </ActionButtons>
                  </ItemFooter>
                </ItemContent>
              </EventItem>
            ))}
          </EventsList>
        )}
      </Container>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";
`;

const EventsList = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const EventItem = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;

  padding: 1.25rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const PosterThumb = styled.div`
  max-width: 20.25rem;
  max-height: 9.0625rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: var(--ma-gray-100);

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemContent = styled.div`
  flex: 1 1 360px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const EventNameHeading = styled.h4`
  color: var(--ma-blue);
  font-weight: 600;
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const MetaInfo = styled.div`
  flex: 1 1 auto;
  color: var(--ma-gray-500);

  > * + * {
    margin-top: 0.5rem;
  }
`;

const InfoLabelWithIcon = styled.div`
  > * + * {
    margin-left: 0.5rem;
  }
`;

const ActionButtons = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 0.5rem;
`;

export default PageEventsHome;

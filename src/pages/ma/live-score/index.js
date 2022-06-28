import * as React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useEventDetailFromSlug } from "./hooks/event-detail-slug";
import { useCategoryFilters } from "./hooks/category-filters";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { ButtonBlue, SpinnerDotBlock } from "components/ma";
import { BreadcrumbDashboard } from "../dashboard/components/breadcrumb";
import { CategoryFilterChooser, LiveIndicator, ScoringTable } from "./components";
import { TeamFilterChooser } from "./components/team-filter-chooser";

import { isAfter } from "date-fns";
import { datetime } from "utils";
import { getLandingPagePath } from "./utils";

function PageScoreQualification() {
  const { slug } = useParams();
  const { data: eventDetail, status: eventStatus } = useEventDetailFromSlug(slug);
  const eventId = eventDetail?.id;
  const {
    isLoading: isLoadingCategory,
    selectCategory,
    categoryOptions,
    activeCategory,
    teamOptions,
    selectTeam,
    activeTeam,
  } = useCategoryFilters(eventId);

  const isLoadingEvent = eventStatus === "loading";
  const eventName = eventDetail?.publicInformation.eventName || "My Archery Event";
  const isEventEnded = _checkIsEventEnded(eventDetail?.publicInformation.eventEnd);

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Live Score Kualifikasi - {eventName} | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to={getLandingPagePath(eventDetail?.publicInformation.eventUrl)}>
          {eventDetail ? "Kembali" : ""}
        </BreadcrumbDashboard>

        {!eventDetail && isLoadingEvent ? (
          <SpinnerDotBlock />
        ) : (
          <ContentHeader>
            <div>
              <EventName>{eventName}</EventName>
              <MetaInfo>
                <LiveIndicator />
                <span>| Babak Kualifikasi</span>
              </MetaInfo>
            </div>
            <div></div>
          </ContentHeader>
        )}

        {isLoadingCategory ? (
          <SpinnerDotBlock />
        ) : (
          eventDetail && (
            <PanelWithStickSidebar>
              <PanelSidebar>
                <NavElimination>
                  <ButtonNavToElimination to={`/live-score/${slug}/elimination`}>
                    Lihat Bagan Eliminasi
                  </ButtonNavToElimination>
                </NavElimination>

                <CategoryFilterChooser
                  breakpoint="min-width: 1081px"
                  options={categoryOptions}
                  selected={activeCategory}
                  onChange={(category) => selectCategory(category)}
                />
              </PanelSidebar>

              <div>
                <ListViewToolbar>
                  <LabelCurrentCategory>
                    {activeCategory?.label || "Pilih kategori"}
                  </LabelCurrentCategory>

                  <ScrollX>
                    <SpaceButtonsGroup>
                      <TeamFilterChooser
                        options={teamOptions}
                        selected={activeTeam}
                        onSelect={(index) => selectTeam(index)}
                      />
                    </SpaceButtonsGroup>
                  </ScrollX>
                </ListViewToolbar>

                <ScrollX>
                  <ScoringTable
                    // ! Penting: wajib kasih prop key unik di komponen ini
                    key={activeCategory?.id || "table-00"}
                    categoryDetail={activeCategory}
                    // TODO: `isEventEnded` lebih proper namanya diganti `shouldPollData`
                    isEventEnded={isEventEnded}
                  />
                </ScrollX>
              </div>
            </PanelWithStickSidebar>
          )
        )}
      </Container>
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  font-family: "Inter", sans-serif;
`;

const Container = styled(BSContainer)`
  margin-bottom: 5rem;
`;

const ContentHeader = styled.div`
  margin-bottom: 1.375rem;
`;

const EventName = styled.h4`
  color: var(--ma-blue);
  font-weight: 600;
  text-transform: uppercase;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;

const PanelWithStickSidebar = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }

  @media (min-width: 961px) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;

    > *:last-child {
      flex: 16 0 18.75rem;
    }

    > * + * {
      margin-top: 0;
    }
  }
`;

const PanelSidebar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  gap: 1.5rem;

  > *:first-child {
    flex-basis: 240px;
    flex-grow: 1;
  }

  > *:last-child {
    flex-basis: 360px;
    flex-grow: 10;
  }

  @media (min-width: 961px) {
    display: block;
    flex: 1 0 16.25rem;
    max-width: 16.25rem;
    position: sticky;
    top: calc(var(--ma-header-height) + 2.5rem);

    > * + * {
      margin-top: 1.5rem;
    }
  }
`;

const NavElimination = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

function ButtonLink(props) {
  return <ButtonBlue as={Link} {...props} />;
}

const ButtonNavToElimination = styled(ButtonLink)`
  &,
  &:focus,
  &:active {
    width: 100%;
    border-radius: 0.5rem;
  }
`;

const ListViewToolbar = styled.div`
  padding: 0.75rem 0.75rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: var(--ma-blue);
  color: #ffffff;
  text-transform: capitalize;

  @media (min-width: 961px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    padding: 0.625rem 1.375rem;
  }
`;

const LabelCurrentCategory = styled.div`
  font-weight: 600;
  font-size: 1.125em;
  display: none;

  @media (min-width: 1081px) {
    display: block;
  }
`;

const ScrollX = styled.div`
  overflow-x: auto;
`;

const SpaceButtonsGroup = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (min-width: 721px) {
    justify-content: flex-end;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

/* ================================= */
// utils

function _checkIsEventEnded(dateString) {
  if (!dateString) {
    return false;
  }
  const endDate = datetime.parseServerDatetime(dateString);
  return isAfter(new Date(), endDate);
}

export default PageScoreQualification;

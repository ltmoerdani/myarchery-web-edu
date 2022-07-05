import * as React from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useEventDetailFromSlug } from "./hooks/event-detail-slug";
import { useCategoryFilters } from "./hooks/category-filters";
import { useMatchTemplate } from "./hooks/match-template";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { BreadcrumbDashboard } from "../dashboard/components/breadcrumb";
import { SpinnerDotBlock } from "components/ma";
import {
  LiveIndicator,
  CategoryFilterChooser,
  FullPageLoadingIndicator,
  MatchBracket,
} from "./components";
import { TeamFilterChooser } from "./components/team-filter-chooser";

import { isAfter } from "date-fns";
import { datetime } from "utils";
import { getQualificationScorePageUrl } from "./utils";

function PageScoreElimination() {
  const { pathname } = useLocation();
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
    activeCategoryDetail,
  } = useCategoryFilters(eventId);

  const {
    data: matchTemplate,
    status: statusMatchTemplate,
    reset: resetBracket,
  } = useMatchTemplate(activeCategoryDetail?.id, isEventEnded);

  const isLoadingEvent = eventStatus === "loading";
  const isLoadingBracket = statusMatchTemplate === "loading";
  const eventName = eventDetail?.publicInformation.eventName || "My Archery Event";
  const isEventEnded = _checkIsEventEnded(eventDetail?.publicInformation.eventEnd);

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Live Score Eliminasi - {eventName} | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to={getQualificationScorePageUrl(pathname)}>
          {eventDetail ? "Live Score Kualifikasi" : ""}
        </BreadcrumbDashboard>

        <ContentContainer>
          {!eventDetail && isLoadingEvent ? (
            <SpinnerDotBlock />
          ) : (
            <ContentHeader>
              <div>
                <EventName>{eventName}</EventName>
                <MetaInfo>
                  <LiveIndicator />
                  <span>| Babak Eliminasi</span>
                </MetaInfo>
              </div>
              <div></div>
            </ContentHeader>
          )}

          {isLoadingCategory ? (
            <SpinnerDotBlock />
          ) : (
            eventDetail && (
              <PanelWithStickySidebar>
                <PanelSidebar>
                  <CategoryFilterChooser
                    breakpoint="min-width: 1440px"
                    options={categoryOptions}
                    selected={activeCategory}
                    onChange={(category) => {
                      selectCategory(category);
                      resetBracket();
                    }}
                  />
                </PanelSidebar>

                <div>
                  <ListViewToolbar>
                    <LabelCurrentCategory>
                      {activeCategory || "Pilih kategori"}
                    </LabelCurrentCategory>

                    <ScrollX>
                      <SpaceButtonsGroup>
                        <TeamFilterChooser
                          options={teamOptions}
                          selected={activeTeam}
                          onSelect={(opt) => {
                            selectTeam(opt.id);
                            resetBracket();
                          }}
                        />
                      </SpaceButtonsGroup>
                    </ScrollX>
                  </ListViewToolbar>

                  <SectionTableContainer key={activeCategoryDetail?.id}>
                    <FullPageLoadingIndicator isLoading={isLoadingBracket} />
                    <MatchBracketContainer>
                      {(matchTemplate?.eliminationId || matchTemplate?.eliminationGroupId) &&
                      matchTemplate?.rounds ? (
                        <OverflowingBracketContent>
                          <MatchBracket matchTemplate={matchTemplate} />
                        </OverflowingBracketContent>
                      ) : isLoadingBracket ? (
                        <SettingsNotApplied>Sedang menyiapkan bagan...</SettingsNotApplied>
                      ) : (
                        <SettingsNotApplied>
                          <h5>Belum ada pertandingan untuk kategori ini</h5>
                        </SettingsNotApplied>
                      )}
                    </MatchBracketContainer>
                  </SectionTableContainer>
                </div>
              </PanelWithStickySidebar>
            )
          )}
        </ContentContainer>
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

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const PanelWithStickySidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1440px) {
    flex-direction: row;

    > *:nth-child(2) {
      flex-grow: 1;
      max-width: 900px;
    }
  }
`;

const PanelSidebar = styled.div`
  display: block;
  flex-grow: 1;
  position: sticky;
  top: calc(var(--ma-header-height) + 2.5rem);
`;

const ListViewToolbar = styled.div`
  padding: 0.75rem 0.75rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: var(--ma-blue);
  color: #ffffff;
  text-transform: capitalize;

  @media (min-width: 1440px) {
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

  @media (min-width: 1440px) {
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

const SectionTableContainer = styled.div`
  position: relative;
`;

const MatchBracketContainer = styled.div`
  overflow-x: auto;
  min-height: 400px;
  background-color: #fbfbfb;
`;

const OverflowingBracketContent = styled.div`
  padding: 1rem;
`;

const SettingsNotApplied = styled.div`
  height: 400px;
  padding: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  > * {
    color: var(--ma-gray-400);
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

export default PageScoreElimination;

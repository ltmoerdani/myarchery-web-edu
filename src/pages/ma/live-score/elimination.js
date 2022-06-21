import * as React from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useEventDetailFromSlug } from "./hooks/event-detail-slug";
import { useCategoriesByGenderElimination } from "./hooks/event-categories-by-gender-elimination";
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

import classnames from "classnames";
import { isAfter } from "date-fns";
import { datetime } from "utils";
import { getQualificationScorePageUrl, makeCategoryOptions, getTabNameFromKey } from "./utils";

function PageScoreElimination() {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const { data: eventDetail, status: eventStatus } = useEventDetailFromSlug(slug);
  const eventId = eventDetail?.id;
  const isEventEnded = _checkIsEventEnded(eventDetail?.publicInformation.eventEnd);

  const {
    data: categories,
    groupNames: teamCategories,
    status: categoryStatus,
  } = useCategoriesByGenderElimination(eventId);
  const [teamFilterSelected, setTeamFilterSelected] = React.useState(0);

  const currentTeamFilterName = teamCategories[teamFilterSelected];
  const categoryOptions = makeCategoryOptions(categories?.[currentTeamFilterName]);

  const [categorySelected, dispatchCategorySelected] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    {}
  );

  React.useEffect(() => {
    if (!categoryOptions?.length || categorySelected[currentTeamFilterName]) {
      return;
    }
    dispatchCategorySelected({ [currentTeamFilterName]: categoryOptions[0] });
  }, [currentTeamFilterName]);

  const { data: matchTemplate, status: statusMatchTemplate } = useMatchTemplate(
    categorySelected?.[currentTeamFilterName]?.id,
    isEventEnded
  );

  const eventName = eventDetail?.publicInformation.eventName || "My Archery Event";
  const isLoadingEvent = eventStatus === "loading";
  const isLoadingCategory = categoryStatus === "loading";
  const isLoadingMatchTemplate = statusMatchTemplate === "loading";

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Live Score Eliminasi - {eventName} | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to={getQualificationScorePageUrl(pathname)}>
          {eventDetail ? "Live Score Kualifikasi" : ""}
        </BreadcrumbDashboard>

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

        {!categories && isLoadingCategory ? (
          <SpinnerDotBlock />
        ) : (
          eventDetail && (
            <PanelWithStickySidebar>
              <PanelSidebar>
                <CategoryFilterChooser
                  breakpoint="min-width: 961px"
                  options={categoryOptions}
                  selected={categorySelected[currentTeamFilterName]}
                  onChange={(category) => {
                    dispatchCategorySelected({ [currentTeamFilterName]: category });
                  }}
                />
              </PanelSidebar>

              <div>
                <ListViewToolbar>
                  <LabelCurrentCategory>
                    {categorySelected[currentTeamFilterName]?.label || "Pilih kategori"}
                  </LabelCurrentCategory>

                  <ScrollX>
                    <SpaceButtonsGroup>
                      {teamCategories?.map((filter, index) => {
                        return (
                          <ButtonTeamFilter
                            key={filter}
                            className={classnames({
                              "filter-selected": teamFilterSelected === index,
                            })}
                            onClick={() => setTeamFilterSelected(index)}
                          >
                            {getTabNameFromKey(filter)}
                          </ButtonTeamFilter>
                        );
                      })}
                    </SpaceButtonsGroup>
                  </ScrollX>
                </ListViewToolbar>

                <SectionTableContainer>
                  <FullPageLoadingIndicator isLoading={isLoadingMatchTemplate} />

                  <MatchBracketContainer>
                    {(matchTemplate?.eliminationId || matchTemplate?.eliminationGroupId) &&
                    matchTemplate?.rounds ? (
                      <OverflowingBracketContent>
                        <MatchBracket matchTemplate={matchTemplate} />
                      </OverflowingBracketContent>
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

const PanelWithStickySidebar = styled.div`
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

const ButtonTeamFilter = styled.button`
  &,
  &:focus,
  &:active {
    padding: 0.75rem 1rem;
    border: solid 1px var(--ma-primary-blue-50);
    border-radius: 0.5rem;
    background-color: var(--ma-primary-blue-50);
    color: var(--ma-blue);
    font-size: 0.875em;

    @media (min-width: 721px) {
      padding: 0.5rem 0.75rem;
    }
  }

  white-space: nowrap;
  transition: border-color 0.1s, background-color 0.1s;

  &.filter-selected {
    border: solid 1px var(--ma-secondary);
    background-color: var(--ma-secondary);
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

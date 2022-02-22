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
  TableLoadingIndicator,
  MatchBracket,
} from "./components";

import classnames from "classnames";
import { getQualificationScorePageUrl, makeCategoryOptions, getTabNameFromKey } from "./utils";

function PageScoreElimination() {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const { data: eventDetail, status: eventStatus } = useEventDetailFromSlug(slug);
  const eventId = eventDetail?.id;

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
    if (!categoryOptions?.length) {
      return;
    }
    dispatchCategorySelected({ [currentTeamFilterName]: categoryOptions[0] });
  }, [currentTeamFilterName]);

  const {
    data: matchTemplate,
    status: statusMatchTemplate,
    refetch: refetchMatchTemplate,
  } = useMatchTemplate(categorySelected?.[currentTeamFilterName]?.id);

  React.useEffect(() => {
    const timerRefetch = setInterval(() => {
      refetchMatchTemplate();
    }, 10000);

    return () => clearInterval(timerRefetch);
  }, []);

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
                </ListViewToolbar>

                <SectionTableContainer>
                  <TableLoadingIndicator isLoading={isLoadingMatchTemplate} />

                  <MatchBracketContainer>
                    {matchTemplate?.rounds && !matchTemplate.updated ? (
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;

  > *:first-child {
    flex: 1 0 16.25rem;
    max-width: 16.25rem;
    position: sticky;
    top: calc(var(--ma-header-height) + 2.5rem);
  }

  > *:last-child {
    flex: 16 0 18.75rem;
  }
`;

const PanelSidebar = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const ListViewToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  padding: 0.625rem 1.375rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: var(--ma-blue);
  color: #ffffff;
  text-transform: capitalize;
`;

const LabelCurrentCategory = styled.div`
  font-weight: 600;
  font-size: 1.125em;
`;

const SpaceButtonsGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 0.5rem;
`;

const ButtonTeamFilter = styled.button`
  &,
  &:focus,
  &:active {
    padding: 0.5rem 0.75rem;
    border: solid 1px var(--ma-primary-blue-50);
    border-radius: 0.5rem;
    background-color: var(--ma-primary-blue-50);
    color: var(--ma-blue);
    font-size: 0.875em;
  }

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
  overflow: auto;
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

export default PageScoreElimination;

import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEventDetailFromSlug } from "./hooks/event-detail-slug";
import { useCategoriesByGender } from "./hooks/event-categories-by-gender";
import { useParticipantScorings } from "./hooks/participant-scorings";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { ButtonBlue, SpinnerDotBlock } from "components/ma";
import { BreadcrumbDashboard } from "../dashboard/components/breadcrumb";
import {
  CategoryFilterChooser,
  LiveIndicator,
  RankIndicator,
  SessionCellsDataHeading,
  SessionCellsData,
  TableLoadingIndicator,
} from "./components";

import classnames from "classnames";
import { makeCategoryOptions, getLandingPagePath } from "./utils";

function PageScoreQualification() {
  const { slug } = useParams();
  const { data: eventDetail, status: eventStatus } = useEventDetailFromSlug(slug);
  const eventId = eventDetail?.id;

  const {
    data: categories,
    groupNames: teamCategories,
    status: categoryStatus,
  } = useCategoriesByGender(eventId);
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

  const { data: scorings, status: scoringsStatus } = useParticipantScorings(
    categorySelected[currentTeamFilterName]?.id
  );

  const handleSelectCategory = (category) =>
    dispatchCategorySelected({ [currentTeamFilterName]: category });

  const isLoadingEvent = eventStatus === "loading";
  const isLoadingCategory = categoryStatus === "loading";
  const isLoadingScorings = scoringsStatus === "loading";
  const eventName = eventDetail?.publicInformation.eventName || "My Archery Event";

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Live Score - {eventName} | MyArchery.id</title>
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

        {!categories && isLoadingCategory ? (
          <SpinnerDotBlock />
        ) : (
          eventDetail && (
            <PanelWithStickSidebar>
              <PanelSidebar>
                <NavElimination>
                  <ButtonNavToElimination>Lihat Bagan Eliminasi</ButtonNavToElimination>
                </NavElimination>

                <CategoryFilterChooser
                  options={categoryOptions}
                  selected={categorySelected[currentTeamFilterName]}
                  onChange={(category) => handleSelectCategory(category)}
                />
              </PanelSidebar>

              <div>
                <ListViewToolbar>
                  <LabelCurrentCategory>
                    {categorySelected[currentTeamFilterName]?.label || "Pilih kategori"}
                  </LabelCurrentCategory>
                  <SpaceButtonsGroup>
                    {teamCategories?.map((filter) => {
                      if (filter === "individu male") {
                        return (
                          <ButtonTeamFilter
                            key={filter}
                            className={classnames({ "filter-selected": teamFilterSelected === 0 })}
                            onClick={() => setTeamFilterSelected(0)}
                          >
                            Individu Putra
                          </ButtonTeamFilter>
                        );
                      }
                      if (filter === "individu female") {
                        return (
                          <ButtonTeamFilter
                            key={filter}
                            className={classnames({ "filter-selected": teamFilterSelected === 1 })}
                            onClick={() => setTeamFilterSelected(1)}
                          >
                            Individu Putri
                          </ButtonTeamFilter>
                        );
                      }
                    })}
                  </SpaceButtonsGroup>
                </ListViewToolbar>

                <SectionTableContainer>
                  <TableLoadingIndicator isLoading={isLoadingScorings} />

                  <TableScores>
                    <thead>
                      <tr>
                        <th>Peringkat</th>
                        <th className="text-uppercase">Nama</th>
                        <th className="text-uppercase">Klub</th>
                        <SessionCellsDataHeading sessions={scorings?.[0]?.sessions} />
                        <th className="text-uppercase">Total</th>
                        <th className="text-uppercase">X</th>
                        <th className="text-uppercase">X+10</th>
                      </tr>
                    </thead>

                    {scorings && (
                      <tbody>
                        {scorings.map((scoring, index) => (
                          <tr key={scoring.member.id}>
                            <td>
                              <DisplayRank>
                                <span>{index + 1}</span>
                                <RankIndicator direction={scoring.totalTmp} />
                              </DisplayRank>
                            </td>
                            <td>{scoring.member.name}</td>
                            <td>
                              {scoring.member.clubName || <React.Fragment>&ndash;</React.Fragment>}
                            </td>
                            <SessionCellsData sessions={scoring.sessions} />
                            <td>{scoring.total}</td>
                            <td>{scoring.totalX}</td>
                            <td>{scoring.totalXPlusTen}</td>
                          </tr>
                        ))}
                        {!scorings.length && (
                          <tr>
                            <td colSpan="6">
                              <ScoringEmptyRow>Belum ada data skor di kategori ini</ScoringEmptyRow>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </TableScores>
                </SectionTableContainer>
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

const NavElimination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonNavToElimination = styled(ButtonBlue)`
  &,
  &:focus,
  &:active {
    width: 100%;
    border-radius: 0.5rem;
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

const TableScores = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.25rem;

  th,
  td {
    cursor: auto;
  }

  thead > tr > th {
    padding: 0.75rem;
    background-color: var(--ma-primary-blue-50);
  }

  tbody > tr > td {
    padding: 0.8125rem 0.625rem;
    background-color: #ffffff;
    font-size: 0.875em;
  }
`;

const DisplayRank = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ScoringEmptyRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default PageScoreQualification;

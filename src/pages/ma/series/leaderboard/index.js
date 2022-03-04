import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useSeriesCategories } from "./hooks/series-categories";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { SpinnerDotBlock } from "components/ma";
import { BreadcrumbDashboard } from "../../dashboard/components/breadcrumb";
import { CategoryFilterChooser } from "../../live-score/components";
import { RankingTable } from "./components/ranking-table";

import classnames from "classnames";
import { makeCategoryOptions } from "./utils";

const teamCategoryOptions = [
  { label: "Individu Putra", value: "individu male" },
  { label: "Individu Putri", value: "individu female" },
];

function PageSeriesLeaderboard() {
  const { series_id } = useParams();
  const seriesId = parseInt(series_id);
  const { data: seriesData, isLoading: isLoadingSeriesData } = useSeriesCategories(seriesId);
  const { detailSeries: series, categorySeries: categories } = seriesData || {};

  const [teamCategorySelected, setTeamCategorySelected] = React.useState(teamCategoryOptions[0]);

  const categoryOptions = makeCategoryOptions(categories, teamCategorySelected);
  const [categorySelected, dispatchCategorySelected] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    {}
  );

  React.useEffect(() => {
    if (!categoryOptions?.length || categorySelected[teamCategorySelected.value]) {
      return;
    }

    dispatchCategorySelected({ [teamCategorySelected.value]: categoryOptions[0] });
  }, [categoryOptions, teamCategorySelected]);

  return (
    <StyledPageWrapper>
      <MetaTags>
        {series?.name ? (
          <title>Pemeringkatan Series - {series.name} | MyArchery.id</title>
        ) : (
          <title>Pemeringkatan Series | MyArchery.id</title>
        )}
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="/home">
          {series?.name ? series.name : "Kembali"}
        </BreadcrumbDashboard>

        {!seriesData && isLoadingSeriesData ? (
          <SpinnerDotBlock />
        ) : (
          <ContentHeader>
            <div>
              <EventName>Pemeringkatan Series</EventName>
            </div>
            <div></div>
          </ContentHeader>
        )}

        {!categories && isLoadingSeriesData ? (
          <SpinnerDotBlock />
        ) : (
          <PanelWithStickSidebar>
            <PanelSidebar>
              <CategoryFilterChooser
                breakpoint="min-width: 1081px"
                options={categoryOptions}
                selected={categorySelected[teamCategorySelected.value]}
                onChange={(category) => {
                  dispatchCategorySelected({ [teamCategorySelected.value]: category });
                }}
              />
            </PanelSidebar>

            <div>
              <ListViewToolbar>
                <LabelCurrentCategory>
                  {categorySelected[teamCategorySelected.value]?.label || "Pilih kategori"}
                </LabelCurrentCategory>

                <ScrollX>
                  <SpaceButtonsGroup>
                    {teamCategoryOptions?.map((filter) => (
                      <ButtonTeamFilter
                        key={filter.value}
                        className={classnames({
                          "filter-selected": filter.value === teamCategorySelected.value,
                        })}
                        onClick={() => setTeamCategorySelected(filter)}
                      >
                        {filter.label}
                      </ButtonTeamFilter>
                    ))}
                  </SpaceButtonsGroup>
                </ScrollX>
              </ListViewToolbar>

              <RankingTable categoryDetail={categorySelected[teamCategorySelected.value]} />
            </div>
          </PanelWithStickSidebar>
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

const ListViewToolbar = styled.div`
  padding: 0.75rem 0.75rem;
  border-radius: 0.5rem;
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

export default PageSeriesLeaderboard;

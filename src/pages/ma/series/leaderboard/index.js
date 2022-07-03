import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useSeriesCategories } from "./hooks/series-categories";
import { useCategoryFilters } from "./hooks/series-category-filters";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { SpinnerDotBlock, AlertSubmitError } from "components/ma";
import { BreadcrumbDashboard } from "../../dashboard/components/breadcrumb";
import { CategoryFilterChooser } from "../../live-score/components";
import { RankingTable } from "./components/ranking-table";

import classnames from "classnames";

function PageSeriesLeaderboard() {
  const { series_id } = useParams();
  const seriesId = parseInt(series_id);
  const { data: seriesData, isError, errors } = useSeriesCategories(seriesId);
  const { detailSeries: series, categorySeries: categories } = seriesData || {};

  const {
    isLoading: isLoadingSeries,
    selectCategory,
    categoryOptions,
    activeCategory,
    teamOptions,
    selectTeam,
    activeTeam,
    activeCategoryDetail,
  } = useCategoryFilters(categories);

  const isLoading = !categories && isLoadingSeries;

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

        {isLoading ? (
          <SpinnerDotBlock />
        ) : (
          <ContentHeader>
            <div>
              <EventName>Pemeringkatan Series</EventName>
            </div>
            <div></div>
          </ContentHeader>
        )}

        {isLoading ? (
          <SpinnerDotBlock />
        ) : (
          <PanelWithStickSidebar>
            <PanelSidebar>
              <CategoryFilterChooser
                breakpoint="min-width: 1200px"
                options={categoryOptions}
                selected={activeCategory}
                onChange={(category) => selectCategory(category)}
              />
            </PanelSidebar>

            <div>
              <ListViewToolbar>
                <LabelCurrentCategory>{activeCategory || "Pilih kategori"}</LabelCurrentCategory>

                <ScrollX>
                  <SpaceButtonsGroup>
                    {teamOptions?.map((filter) => (
                      <ButtonTeamFilter
                        key={filter.id}
                        className={classnames({ "filter-selected": filter.id === activeTeam })}
                        onClick={() => selectTeam(filter.id)}
                      >
                        {filter.label}
                      </ButtonTeamFilter>
                    ))}
                  </SpaceButtonsGroup>
                </ScrollX>
              </ListViewToolbar>

              <RankingTable key={activeCategoryDetail?.id} categoryDetail={activeCategoryDetail} />
            </div>
          </PanelWithStickSidebar>
        )}
      </Container>
      <AlertSubmitError isError={isError} errors={errors} />
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

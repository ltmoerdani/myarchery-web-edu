import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useSeriesCategories } from "./hooks/series-categories";
import { useRankedMembers } from "./hooks/ranked-members";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { AvatarDefault, SpinnerDotBlock } from "components/ma";
import { BreadcrumbDashboard } from "../../dashboard/components/breadcrumb";
import { FieldSelect } from "./components/field-select";
import { FullPageLoadingIndicator } from "./components/portal-loading";

import { makeCategoryOptions } from "./utils";

const teamCategoryOptions = [
  { label: "Individu Putra", value: "individu male" },
  { label: "Individu Putri", value: "individu female" },
];

function PageSeriesLeaderboard() {
  const { series_id } = useParams();
  const seriesId = parseInt(series_id);
  const { data: seriesData } = useSeriesCategories(seriesId);
  const { detailSeries: series, categorySeries: categories } = seriesData || {};

  const [teamCategorySelected, setTeamCategorySelected] = React.useState(teamCategoryOptions[0]);

  const categoryOptions = makeCategoryOptions(categories, teamCategorySelected);
  const [categorySelected, setCategorySelected] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    {}
  );

  const { value: categoryId } = categorySelected[teamCategorySelected.value] || {};
  const { data: rankedMembers, isLoading: isLoadingRankedMembers } = useRankedMembers(categoryId);

  React.useEffect(() => {
    if (!categories) {
      return;
    }

    !categorySelected[teamCategorySelected.value] &&
      setCategorySelected({ [teamCategorySelected.value]: categoryOptions[0] });
  }, [categories, teamCategorySelected]);

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

        <InnerContainer>
          <h2>Pemeringkatan Series</h2>

          {categories ? (
            <FiltersBar>
              <div>
                <FieldSelect
                  options={teamCategoryOptions}
                  value={teamCategorySelected}
                  onChange={(option) => setTeamCategorySelected(option)}
                />
              </div>

              <div>
                <FieldSelect
                  options={categoryOptions}
                  value={categorySelected[teamCategorySelected.value]}
                  onChange={(option) => {
                    setCategorySelected({ [teamCategorySelected.value]: option });
                  }}
                />
              </div>
            </FiltersBar>
          ) : (
            <SpinnerDotBlock />
          )}

          <div>
            {rankedMembers && (
              <React.Fragment>
                <FullPageLoadingIndicator isLoading={isLoadingRankedMembers} />

                {isLoadingRankedMembers ? (
                  <EmptyRank>Sedang memuat data pemeringkatan...</EmptyRank>
                ) : rankedMembers.length > 0 ? (
                  <RanksList>
                    {rankedMembers.map((member) => (
                      <li key={member.detailUsers.userId}>
                        <RankItem>
                          <BlockRankNo>{member.position}</BlockRankNo>

                          <BlockMain>
                            <BlockAvatar>
                              <AvatarContainer>
                                {member.detailUsers.avatar ? (
                                  <img src={member.detailUsers.avatar} />
                                ) : (
                                  <AvatarDefault fullname={member.detailUsers.name} />
                                )}
                              </AvatarContainer>
                            </BlockAvatar>

                            <BlockData>
                              <div>
                                <ArcherName>{member.detailUsers.name}</ArcherName>
                                <ClubName>{member.detailClub.name}</ClubName>
                              </div>

                              <BlockPoints>{member.point}</BlockPoints>
                            </BlockData>
                          </BlockMain>
                        </RankItem>
                      </li>
                    ))}
                  </RanksList>
                ) : (
                  <EmptyRank>Belum ada data pemeringkatan di kategori ini</EmptyRank>
                )}
              </React.Fragment>
            )}
          </div>
        </InnerContainer>
      </Container>
    </StyledPageWrapper>
  );
}

function BlockRankNo({ children }) {
  const renderRankNumber = (number) => {
    if (number < 10 && number >= 0) {
      return "0" + number;
    }
    return number;
  };

  return (
    <StyledBlockRankNo>
      <span>{renderRankNumber(children)}</span>
    </StyledBlockRankNo>
  );
}

const StyledPageWrapper = styled.div`
  font-family: "Inter", sans-serif;
`;

const Container = styled(BSContainer)`
  margin-bottom: 5rem;
`;

const InnerContainer = styled.div`
  max-width: 60rem;
  margin: 0 auto;

  > * + * {
    margin-top: 1.5rem;
  }
`;

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;

  > * {
    flex-grow: 1;
    flex-basis: 300px;
  }
`;

const EmptyRank = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
  color: var(--ma-gray-400);
`;

const RanksList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  > li + li {
    margin-top: 0.625rem;
  }
`;

const RankItem = styled.div`
  display: flex;

  > *:first-child {
    flex-shrink: 0;
  }

  > *:last-child {
    flex-grow: 1;
  }
`;

const StyledBlockRankNo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 3.75rem;
  padding: 0.5rem;

  > span {
    font-size: 1rem;
    font-weight: 600;
  }
`;

const BlockMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #ffffff;

  > *:first-child {
    flex-shrink: 0;
  }

  > *:last-child {
    flex-grow: 1;
  }
`;

const BlockAvatar = styled.div`
  padding: 1rem;
  padding-right: 0;
`;

const AvatarContainer = styled.div`
  overflow: hidden;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--ma-gray-50);
`;

const BlockData = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem 1rem;
  padding: 1rem;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    flex-shrink: 0;
  }
`;

const ArcherName = styled.h6`
  margin: 0;
  font-weight: 600;
`;

const ClubName = styled.div`
  font-size: 13px;
  color: var(--ma-gray-400);
`;

const BlockPoints = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
`;

export default PageSeriesLeaderboard;

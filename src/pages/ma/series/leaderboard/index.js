import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useSeries } from "../hooks/series";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { AvatarDefault } from "components/ma";
import { BreadcrumbDashboard } from "../../dashboard/components/breadcrumb";
import { FieldSelect } from "../components/field-select";

const teamCategoryOptions = [
  { label: "Individu Putra", value: "individu male" },
  { label: "Individu Putri", value: "individu female" },
];

function PageSeriesLeaderboard() {
  const { slug } = useParams();
  const { data: series } = useSeries(slug);

  return (
    <StyledPageWrapper>
      <MetaTags>
        {series?.seriesName ? (
          <title>Pemeringkatan Series - {series.seriesName} | MyArchery.id</title>
        ) : (
          <title>Pemeringkatan Series | MyArchery.id</title>
        )}
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="/home">Kembali</BreadcrumbDashboard>

        <InnerContainer>
          <h2>Pemeringkatan Series</h2>

          <FiltersBar>
            <div>
              <FieldSelect options={teamCategoryOptions} value={teamCategoryOptions[0]} />
            </div>
            <div>
              <FieldSelect />
            </div>
          </FiltersBar>

          <div>
            <RanksList>
              {[1, 2, 3, 4, 5, 6].map((id, index) => (
                <li key={id}>
                  <RankItem>
                    <BlockRankNo>{index + 1}</BlockRankNo>

                    <BlockMain>
                      <BlockAvatar>
                        <AvatarContainer>
                          <AvatarDefault fullname="Nama archer panjangnya segini" />
                        </AvatarContainer>
                      </BlockAvatar>

                      <BlockData>
                        <div>
                          <ArcherName>Nama archer panjangnya segini</ArcherName>
                          <ClubName>Nama Klub</ClubName>
                        </div>

                        <BlockPoints>2078</BlockPoints>
                      </BlockData>
                    </BlockMain>
                  </RankItem>
                </li>
              ))}
            </RanksList>
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

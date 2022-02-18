import * as React from "react";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { ButtonBlue } from "components/ma";
import { BreadcrumbDashboard } from "../dashboard/components/breadcrumb";
import { CategoryFilterChooser, LiveIndicator, RankIndicator } from "./components";

import classnames from "classnames";

function PageScoreQualification() {
  const eventName = "Nama Event";
  const categoryOptions = [
    { id: 177, label: "Master - Compound - 50m" },
    { id: 178, label: "Master - Recurve - 70m" },
    { id: 179, label: "U-12 - Nasional - 15m" },
  ];

  const [categorySelected, setCategorySelected] = React.useState(null);
  const [teamFilterSelected, setTeamFilterSelected] = React.useState(1);

  React.useEffect(() => {
    setCategorySelected(categoryOptions[0].id);
  }, []);

  const computeCategory = () => {
    return (
      categoryOptions.find((option) => option.id === categorySelected)?.label || "Pilih kategori"
    );
  };

  const handleSelectCategory = (id) => setCategorySelected(id);

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Live Score - {eventName} | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to={"#"}>oishfasdfla</BreadcrumbDashboard>

        <ContentHeader>
          <div>
            <EventName>Judul Event UPPERCASE</EventName>
            <MetaInfo>
              <LiveIndicator />
              <span>| Babak Kualifikasi</span>
            </MetaInfo>
          </div>
          <div></div>
        </ContentHeader>

        <PanelWithStickSidebar>
          <PanelSidebar>
            <NavElimination>
              <ButtonNavToElimination>Lihat Bagan Eliminasi</ButtonNavToElimination>
            </NavElimination>

            <CategoryFilterChooser
              options={categoryOptions}
              selected={categorySelected}
              onChange={(id) => handleSelectCategory(id)}
            />
          </PanelSidebar>

          <div>
            <ListViewToolbar>
              <LabelCurrentCategory>{computeCategory()}</LabelCurrentCategory>
              <SpaceButtonsGroup>
                <ButtonTeamFilter
                  className={classnames({ "filter-selected": teamFilterSelected === 1 })}
                  onClick={() => setTeamFilterSelected(1)}
                >
                  Individu Putra
                </ButtonTeamFilter>
                <ButtonTeamFilter
                  className={classnames({ "filter-selected": teamFilterSelected === 2 })}
                  onClick={() => setTeamFilterSelected(2)}
                >
                  Individu Putri
                </ButtonTeamFilter>
              </SpaceButtonsGroup>
            </ListViewToolbar>

            <TableScores>
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th className="text-uppercase">Nama</th>
                  <th className="text-uppercase">Klub</th>
                  <th>Sesi 1</th>
                  <th>Sesi 2</th>
                  <th className="text-uppercase">Total</th>
                  <th className="text-uppercase">X</th>
                  <th className="text-uppercase">X+10</th>
                </tr>
              </thead>

              <tbody>
                {[1, 2, 3, 4, 5, 6, 7].map((id, index) => (
                  <tr key={id}>
                    <td>
                      <DisplayRank>
                        <span>{index + 1}</span>
                        {index % 2 === 0 ? (
                          <RankIndicator direction="1" />
                        ) : (
                          <RankIndicator direction="-1" />
                        )}
                      </DisplayRank>
                    </td>
                    <td>Orang Femes</td>
                    <td>Mega Jaya</td>
                    <td>10</td>
                    <td>10</td>
                    <td>100</td>
                    <td>2</td>
                    <td>2</td>
                  </tr>
                ))}
              </tbody>
            </TableScores>
          </div>
        </PanelWithStickSidebar>
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

export default PageScoreQualification;

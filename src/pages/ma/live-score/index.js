import * as React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useEventDetailFromSlug } from "./hooks/event-detail-slug";
import { useCategoriesByGender } from "./hooks/event-categories-by-gender";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { ButtonBlue, SpinnerDotBlock } from "components/ma";
import { BreadcrumbDashboard } from "../dashboard/components/breadcrumb";
import { CategoryFilterChooser, LiveIndicator, ScoringTable } from "./components";

import classnames from "classnames";
import { makeCategoryOptions, getLandingPagePath } from "./utils";

const teamFilterLabels = {
  "individu male": "Individu Putra",
  "individu female": "Individu Putri",
  maleTeam: "Beregu Putra",
  femaleTeam: "Beregu Putri",
  mixTeam: "Beregu Campuran",
};

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
    // otomatis set kategori ketika masih null
    if (!categoryOptions?.length || categorySelected[currentTeamFilterName]) {
      return;
    }

    dispatchCategorySelected({ [currentTeamFilterName]: categoryOptions[0] });
  }, [currentTeamFilterName]);

  const isLoadingEvent = eventStatus === "loading";
  const isLoadingCategory = categoryStatus === "loading";
  const eventName = eventDetail?.publicInformation.eventName || "My Archery Event";

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

        {!categories && isLoadingCategory ? (
          <SpinnerDotBlock />
        ) : (
          eventDetail && (
            <PanelWithStickSidebar>
              <PanelSidebar>
                <NavElimination>
                  <ButtonNavToElimination to={`/live-score/${slug}/elimination`}>
                    Lihat Bagan Eliminasi
                  </ButtonNavToElimination>

                  <ButtonNavToElimination to={`/event-ranks/${eventDetail.id}/clubs`}>
                    Lihat Pemeringkatan Klub
                  </ButtonNavToElimination>
                </NavElimination>

                <CategoryFilterChooser
                  breakpoint="min-width: 1081px"
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
                      {teamCategories?.map((filter, index) => (
                        <ButtonTeamFilter
                          key={filter}
                          className={classnames({
                            "filter-selected": teamFilterSelected === index,
                          })}
                          onClick={() => setTeamFilterSelected(index)}
                        >
                          {teamFilterLabels[filter]}
                        </ButtonTeamFilter>
                      ))}
                    </SpaceButtonsGroup>
                  </ScrollX>
                </ListViewToolbar>

                <ScrollX>
                  <ScoringTable
                    // ! Penting: wajib kasih prop key unik di komponen ini
                    key={categorySelected[currentTeamFilterName]?.id || "table-00"}
                    categoryDetail={categorySelected[currentTeamFilterName]}
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

export default PageScoreQualification;

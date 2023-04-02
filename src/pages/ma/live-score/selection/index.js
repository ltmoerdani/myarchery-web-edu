import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { useEventDetailFromSlug } from "../hooks/event-detail-slug";
import { useCategoryFiltersSelection } from "./hooks/category-filters-selection";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { SpinnerDotBlock } from "components/ma";
import { BreadcrumbDashboard } from "../../dashboard/components/breadcrumb";
import { ScoringTableSelection } from "../components";
import { LiveIndicator } from "../components";
import { TeamFilterChooser } from "../components/team-filter-chooser";
import { SelectCategories } from "./components/select-categories";
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";

import { isAfter } from "date-fns";
import { datetime } from "utils";
import { getLandingPagePath } from "../utils";

function PageScoreSelection() {
  const { slug } = useParams();
  const { data: eventDetail, status: eventStatus } =
    useEventDetailFromSlug(slug);
  const eventId = eventDetail?.id;

  const {
    isLoading: isLoadingCategory,
    optionCategories,
    optionGenders,
    getCategoryDetail,
  } = useCategoryFiltersSelection(eventId);

  const [activeOptionCategory, setActiveOptionCategory] = React.useState(null);
  const [activeOptionGender, setActiveOptionGender] = React.useState(null);
  const [scoreType, setScoreType] = React.useState(3);
  const { isLoggedIn } = useSelector(getAuthenticationStore);
  const history = useHistory();
  const path = window.location.pathname;

  const activeCategory = getCategoryDetail({
    competitionCategory: activeOptionCategory?.value.competitionCategory,
    classCategory: activeOptionCategory?.value.classCategory,
    teamCategory: activeOptionGender?.value,
  });

  React.useEffect(() => {
    if (!isLoggedIn) {
      history.push("/archer/login?path=" + path);
    }
    if (activeCategory) return;
    setActiveOptionCategory(optionCategories?.[0]);
    setActiveOptionGender(optionGenders?.[0]);
  }, [activeCategory, optionCategories, optionGenders]);

  const isLoadingEvent = eventStatus === "loading";
  const eventName =
    eventDetail?.publicInformation.eventName || "My Archery Event";
  const isEventEnded = _checkIsEventEnded(
    eventDetail?.publicInformation.eventEnd
  );
  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Live Score Kualifikasi - {eventName} | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard
          to={getLandingPagePath(eventDetail?.publicInformation.eventUrl)}
        >
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
              </MetaInfo>

              <FilterList>
                <li>
                  <SelectCategories
                    options={optionCategories}
                    value={activeOptionCategory}
                    onChange={setActiveOptionCategory}
                  />
                </li>
                <li>
                  <FilterItemButton
                    className={scoreType == 3 ? "filter-item-active" : ""}
                    onClick={() => setScoreType(3)}
                  >
                    Kualifikasi
                  </FilterItemButton>
                </li>
                <li>
                  <FilterItemButton
                    className={scoreType == 4 ? "filter-item-active" : ""}
                    onClick={() => setScoreType(4)}
                  >
                    Eliminasi
                  </FilterItemButton>
                </li>
                <li>
                  <FilterItemButton
                    className={scoreType == 5 ? "filter-item-active" : ""}
                    onClick={() => setScoreType(5)}
                  >
                    Hasil Akhir
                  </FilterItemButton>
                </li>
              </FilterList>
            </div>
            <div></div>
          </ContentHeader>
        )}

        {isLoadingCategory ? (
          <SpinnerDotBlock />
        ) : (
          eventDetail && (
            <PanelWithStickSidebar>
              <div>
                <ListViewToolbar>
                  <LabelCurrentCategory>
                    {`${activeCategory?.competitionCategoryId} - ${activeCategory?.classCategory}` ||
                      "Pilih kategori"}
                  </LabelCurrentCategory>

                  <ScrollX>
                    <SpaceButtonsGroup>
                      <TeamFilterChooser
                        options={optionGenders.map((option) => ({
                          ...option,
                          id: option.value,
                        }))}
                        selected={activeOptionGender?.value}
                        onSelect={setActiveOptionGender}
                      />
                    </SpaceButtonsGroup>
                  </ScrollX>
                </ListViewToolbar>

                <ScrollX>
                  <ScoringTableSelection
                    // ! Penting: wajib kasih prop key unik di komponen ini
                    key={activeCategory?.id || "table-00"}
                    categoryDetail={activeCategory}
                    eventDetail={eventDetail}
                    // // TODO: `isEventEnded` lebih proper namanya diganti `shouldPollData`
                    isEventEnded={isEventEnded}
                    scoreType={scoreType}
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
  margin-bottom: 20px;
`;

const PanelWithStickSidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;

  // @media (min-width: 1200px) {
  //   flex-direction: row;
  //   align-items: flex-start;

  //   > *:nth-child(2) {
  //     flex-grow: 1;
  //     flex-basis: 0;
  //   }
  // }
`;

// const PanelSidebar = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: flex-start;
//   align-items: stretch;
//   gap: 1rem;

//   > *:first-child {
//     flex-basis: 240px;
//     flex-grow: 1;
//   }

//   > *:last-child {
//     flex-basis: 360px;
//     flex-grow: 10;
//   }

//   @media (min-width: 1200px) {
//     display: block;
//     flex: 1 0 16.25rem;
//     max-width: 16.25rem;
//     position: sticky;
//     top: calc(var(--ma-header-height) + 2.5rem);

//     > * + * {
//       margin-top: 1.5rem;
//     }
//   }
// `;

// const NavElimination = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   gap: 1rem;
// `;

// function ButtonLink(props) {
//   return <ButtonBlue as={Link} {...props} />;
// }

// const ButtonNavToElimination = styled(ButtonLink)`
//   &,
//   &:focus,
//   &:active {
//     width: 100%;
//     padding: 0.75rem;
//     border-radius: 0.5rem;

//     @media (min-width: 1200px) {
//       padding: 0.47rem 0.75rem;
//     }
//   }
// `;

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

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterItemButton = styled.button`
  transition: all 0.15s;

  &,
  &:active,
  &:focus,
  &:focus-visible {
    padding: 0.25rem 0.5rem;
    border: solid 1px var(--ma-blue-400);
    border-radius: 0.5rem;
    background-color: transparent;

    color: var(--ma-blue-400);
    font-weight: 600;

    &.filter-item-active {
      background-color: var(--ma-primary-blue-50);
      border-color: var(--ma-blue);
      box-shadow: 0 0 0 1px var(--ma-blue);
      color: var(--ma-blue);
    }
  }

  &:hover {
    background-color: var(--ma-primary-blue-50);
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

export default PageScoreSelection;

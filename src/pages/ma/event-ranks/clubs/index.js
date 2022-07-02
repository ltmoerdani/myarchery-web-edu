import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEventDetail } from "./hooks/event-detail";

import MetaTags from "react-meta-tags";
import { Container as BSContainer } from "reactstrap";
import { SpinnerDotBlock } from "components/ma";
import { BreadcrumbDashboard } from "../../dashboard/components/breadcrumb";
import { CategoryFilterChooser } from "../../live-score/components";
import { RankingTable } from "./components/ranking-table";

function PageEventRanksClubs() {
  const { slug } = useParams();
  const { data: eventDetail, isLoading: isLoadingEventDetail } = useEventDetail(slug);

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Pemeringkatan Klub | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        {eventDetail ? (
          <BreadcrumbDashboard
            to={`/live-score/${eventDetail.publicInformation.eventSlug}/qualification`}
          >
            Live Score Kualifikasi
          </BreadcrumbDashboard>
        ) : (
          <BreadcrumbDashboard to="#">Kembali</BreadcrumbDashboard>
        )}

        {!eventDetail || isLoadingEventDetail ? (
          <SpinnerDotBlock />
        ) : (
          <ContentHeader>
            <div>
              <EventName>{eventDetail.publicInformation.eventName}</EventName>
            </div>
            <div>Pemeringkatan Klub</div>
          </ContentHeader>
        )}

        {!eventDetail || isLoadingEventDetail ? (
          <SpinnerDotBlock />
        ) : (
          <PanelWithStickSidebar>
            <PanelSidebar>
              <CategoryFilterChooser
                breakpoint="min-width: 1081px"
                options={["Semua kategori"]}
                selected="Semua kategori"
                onChange={(category) => category}
              />
            </PanelSidebar>

            <div>
              <ListViewToolbar>
                <LabelCurrentCategory>Semua kategori</LabelCurrentCategory>
              </ListViewToolbar>

              {eventDetail && <RankingTable eventId={eventDetail.id} />}
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
  display: none;

  @media (min-width: 1081px) {
    display: block;
    flex: 1 0 16.25rem;
    max-width: 16.25rem;
    position: sticky;
    top: calc(var(--ma-header-height) + 2.5rem);

    > * + * {
      margin-top: 1.5rem;
    }

    > *:first-child {
      flex-basis: 240px;
      flex-grow: 1;
    }

    > *:last-child {
      flex-basis: 360px;
      flex-grow: 10;
    }
  }
`;

const ListViewToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  padding: 0.625rem 1.375rem;
  min-height: 3.45rem;
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

// const ScrollX = styled.div`
//   overflow-x: auto;
// `;

// const SpaceButtonsGroup = styled.div`
//   display: flex;
//   gap: 0.75rem;

//   @media (min-width: 721px) {
//     justify-content: flex-end;
//     align-items: flex-start;
//     gap: 0.5rem;
//   }
// `;

// const ButtonTeamFilter = styled.button`
//   &,
//   &:focus,
//   &:active {
//     padding: 0.75rem 1rem;
//     border: solid 1px var(--ma-primary-blue-50);
//     border-radius: 0.5rem;
//     background-color: var(--ma-primary-blue-50);
//     color: var(--ma-blue);
//     font-size: 0.875em;

//     @media (min-width: 721px) {
//       padding: 0.5rem 0.75rem;
//     }
//   }

//   white-space: nowrap;
//   transition: border-color 0.1s, background-color 0.1s;

//   &.filter-selected {
//     border: solid 1px var(--ma-secondary);
//     background-color: var(--ma-secondary);
//   }
// `;

export default PageEventRanksClubs;

import React from "react";
import styled from "styled-components";
import { ArcheryClubService } from "services";

import { SkeletonClubItem } from "../../components/skeletons/club-item";
import { EmptyDataWithIllustration } from "./card-empty-data";
import { ClubList } from "./club-list";
import { ListViewHeader } from "./list-view-header";

const TOTAL_LIMIT = 3;
const CURRENT_PAGE = 1;

export function ClubDataListView() {
  const [paginatedClubs, setPaginatedClubs] = React.useState({
    fetchingStatus: "idle",
    clubs: [],
    currentPage: 1,
    isLastPage: false,
    attemptCounts: 0,
  });

  const clubsLoaderDOM = React.useRef(null);

  const { clubs, fetchingStatus, currentPage, isLastPage, attemptCounts } = paginatedClubs;
  const isLoadingClubs = fetchingStatus === "loading";
  const isErrorFetching = fetchingStatus === "error";

  const increaseAttemptCounts = () => {
    setPaginatedClubs((state) => ({ ...state, attemptCounts: state.attemptCounts + 1 }));
  };

  React.useEffect(() => {
    const fetchClubs = async () => {
      setPaginatedClubs((state) => ({ ...state, fetchingStatus: "loading" }));
      const result = await ArcheryClubService.getClubsByUser({
        limit: TOTAL_LIMIT,
        page: currentPage || CURRENT_PAGE,
      });

      if (result.success) {
        setPaginatedClubs((state) => ({
          ...state,
          fetchingStatus: "success",
          clubs: currentPage > 1 ? [...state.clubs, ...result.data] : result.data,
          currentPage: state.currentPage + 1,
          isLastPage: result.data.length < TOTAL_LIMIT,
        }));
      } else {
        setPaginatedClubs((state) => ({ ...state, fetchingStatus: "error" }));
      }
    };

    fetchClubs();
  }, [attemptCounts]);

  React.useEffect(() => {
    if (isLoadingClubs || !clubsLoaderDOM.current || isLastPage) {
      return;
    }
    const option = { root: null, rootMargin: "-40px", threshold: 1 };
    const handleOnOverlapping = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        increaseAttemptCounts();
      }
    };
    const observer = new IntersectionObserver(handleOnOverlapping, option);
    observer.observe(clubsLoaderDOM.current);

    return () => {
      // Berhenti ngemonitor target ketika dia di-unmounted
      // supaya gak fetch dobel-dobel
      observer.disconnect();
    };
  }, [isLoadingClubs, isLastPage]);

  if (isErrorFetching) {
    return (
      <StyledListView className="list-data">
        <ListViewHeader />
        <div style={{ padding: "1.5rem" }}>
          <div className="p-5" style={{ backgroundColor: "var(--ma-gray-50)" }}>
            <h5>Gagal memuat data klub</h5>
          </div>
        </div>
      </StyledListView>
    );
  }

  if (!clubs) {
    return (
      <StyledListView>
        <div className="d-flex justify-content-center align-items-center" style={{ height: 300 }}>
          <h5>Sedang memuat data...</h5>
        </div>
      </StyledListView>
    );
  }

  if (!clubs.length) {
    return <EmptyDataWithIllustration />;
  }

  if (clubs.length) {
    return (
      <StyledListView className="list-data">
        <ListViewHeader />
        <ClubList clubs={clubs} />
        {!isLastPage && (
          <div ref={clubsLoaderDOM}>
            <SkeletonClubItem />
          </div>
        )}
      </StyledListView>
    );
  }

  return <pre>impossible state</pre>;
}

const StyledListView = styled.div`
  position: relative;

  /* card-like container */
  overflow: hidden;
  width: 100%;
  min-height: 320px;
  border-radius: 4px;
  border: 0px solid rgb(246, 246, 246);
  box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
  background-color: #ffffff;
  background-clip: border-box;

  .button-wide {
    min-width: 120px;
  }

  .button-light {
    background-color: #eef3fe;
    border: solid 1px #eef3fe;
    color: var(--ma-blue);
  }
`;

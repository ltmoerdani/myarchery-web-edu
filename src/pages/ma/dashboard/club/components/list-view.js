import React from "react";
import styled from "styled-components";

import { ArcheryClubService } from "services";
import { EmptyDataWithIllustration } from "./card-empty-data";
import { ClubList } from "./club-list";
import { ListViewHeader } from "./list-view-header";

export function ClubDataListView() {
  const [clubs, setClubs] = React.useState(null);
  const [clubsFetchingErrors, setClubsFetchingErrors] = React.useState(null);
  const [shouldExpandError, setExpandError] = React.useState(false);

  React.useEffect(() => {
    const fetchClubs = async () => {
      const clubs = await ArcheryClubService.getUserClubs();
      if (clubs.success) {
        setClubs(clubs.data);
      } else {
        setClubsFetchingErrors({
          errors: clubs?.errors || {},
          message: clubs?.message || "Error tidak diketahui",
        });
      }
    };
    fetchClubs();
  }, []);

  if (clubsFetchingErrors) {
    return (
      <StyledListView className="list-data">
        <ListViewHeader />
        <div style={{ padding: "1.5rem" }}>
          <div className="p-5" style={{ backgroundColor: "var(--ma-gray-50)" }}>
            <h5>Gagal memuat data klub</h5>
            <button
              className="border-0 px-2 py-1 mb-3 rounded-2"
              style={{ backgroundColor: "var(--ma-gray-200)" }}
              onClick={() => setExpandError((expanded) => !expanded)}
            >
              detail
            </button>
            {shouldExpandError && <pre>{JSON.stringify(clubsFetchingErrors.message, null, 2)}</pre>}
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

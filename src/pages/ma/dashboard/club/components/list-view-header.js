import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import { ButtonBlue } from "components/ma";

export function ListViewHeader() {
  return (
    <StyledListViewHeader>
      <h4>Klub Saya</h4>
      <div className="list-view-button-groups">
        <ButtonBlue as={Link} className="button-wide button-light" to="/dashboard/clubs/new">
          Buat Klub
        </ButtonBlue>
        <ButtonBlue as={Link} className="button-wide" to="/dashboard/clubs/join">
          Gabung Klub
        </ButtonBlue>
      </div>
    </StyledListViewHeader>
  );
}

const StyledListViewHeader = styled.div`
  margin-bottom: 1.25rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;

  .list-view-button-groups {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
`;

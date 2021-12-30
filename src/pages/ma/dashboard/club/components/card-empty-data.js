import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import { ButtonBlue } from "components/ma";

import illustrationEmptyState from "assets/images/illustrations/create-club-empty-state.png";

export function EmptyDataWithIllustration() {
  return (
    <StyledCard className="list-empty">
      <div className="ilustration-container">&nbsp;</div>
      <div className="feedback-message">
        Anda belum memiliki klub
        <br />
        Silakan membuat klub
      </div>

      <div className="action-buttons">
        <ButtonBlue as={Link} className="button-wide button-light" to="/dashboard/clubs/new">
          Buat Klub
        </ButtonBlue>

        <ButtonBlue as={Link} className="button-wide" to="/dashboard/clubs/join">
          Gabung Klub
        </ButtonBlue>
      </div>
    </StyledCard>
  );
}

const StyledCard = styled.div`
  position: relative;

  /* card-like container */
  overflow: hidden;
  width: 100%;
  min-height: 320px;
  padding: 3rem 3rem 3.5rem 3rem;
  border-radius: 4px;
  border: 0px solid rgb(246, 246, 246);
  box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
  background-color: #ffffff;
  background-clip: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 1.25rem;

  .button-wide {
    min-width: 120px;
  }

  .button-light {
    background-color: #eef3fe;
    border: solid 1px #eef3fe;
    color: var(--ma-blue);
  }

  .ilustration-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    padding-top: 300px;

    background-image: url(${illustrationEmptyState});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .feedback-message {
    font-size: 1rem;
    text-align: center;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1.25rem;
  }
`;

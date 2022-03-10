import * as React from "react";
import styled from "styled-components";
import { LoadingScreen } from "./loading-screen-portal";

function SpinnerDotBlock() {
  return (
    <StyledSpinnerContainer>
      <div className="spinner-grow" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </StyledSpinnerContainer>
  );
}

const StyledSpinnerContainer = styled.div`
  min-height: 18.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { SpinnerDotBlock, LoadingScreen };

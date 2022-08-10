import * as React from "react";
import styled from "styled-components";

import IconLoading from "./icon-loading";

function LoadingIndicator({ isLoading }) {
  if (!isLoading) {
    return null;
  }
  return (
    <Container>
      <SpinningLoader>
        <IconLoading size="60" />
      </SpinningLoader>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.625);
`;

const SpinningLoader = styled.span`
  display: inline-block;
  color: var(--ma-blue);
  animation: spin-loading 1s infinite linear;

  @keyframes spin-loading {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }
`;

export { LoadingIndicator };

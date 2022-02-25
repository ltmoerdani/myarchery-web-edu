import * as React from "react";
import styled from "styled-components";
import { SpinnerDotBlock } from "components/ma";
import { FullPageLoadingIndicator } from "./portal-loading";

function TableLoadingIndicator({ isLoading }) {
  if (!isLoading) {
    return null;
  }
  return (
    <LoaderContainer>
      <SpinnerDotBlock />
    </LoaderContainer>
  );
}

const LoaderContainer = styled.div`
  position: absolute;
  z-index: 50;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export { TableLoadingIndicator, FullPageLoadingIndicator };

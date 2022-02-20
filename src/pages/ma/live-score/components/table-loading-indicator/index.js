import * as React from "react";
import styled from "styled-components";
import { SpinnerDotBlock } from "components/ma";

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
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export { TableLoadingIndicator };

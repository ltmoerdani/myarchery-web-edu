import * as React from "react";
import styled from "styled-components";

const EventLoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  min-height: 240px;
  border-radius: 8px;
  background-color: #ffffff;
`;

function EventLoading() {
  return <EventLoadingWrapper>Sedang memuat data event...</EventLoadingWrapper>;
}

export default EventLoading;

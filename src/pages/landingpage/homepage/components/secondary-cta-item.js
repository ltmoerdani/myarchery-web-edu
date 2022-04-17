import * as React from "react";
import styled from "styled-components";

import IconChevronRight from "components/ma/icons/mono/chevron-right";

function SecondaryCTAItem({ bgImg, heading, subheading }) {
  return (
    <SecondaryCTAItemWrapper style={{ "--bg-image": `url(${bgImg})` }}>
      <SecondaryCTAContent>
        <SecondaryCTAHeading>{heading}</SecondaryCTAHeading>
        <SecondaryCTASub>
          <span>{subheading}</span>
          <span>
            <IconChevronRight size="14" />
          </span>
        </SecondaryCTASub>
      </SecondaryCTAContent>
    </SecondaryCTAItemWrapper>
  );
}

const SecondaryCTAItemWrapper = styled.div`
  padding: 1.5rem;
  height: 6.25rem;
  border-radius: 8px;
  border: 3px solid var(--ma-blue);
  background-color: var(--ma-blue);
  background-image: var(--bg-image);
  background-repeat: no-repeat;
  background-position: -2.5rem center;
  background-size: contain;
  cursor: pointer;

  @media (min-width: 455px) {
    background-position: left center;
  }

  @media (min-width: 769px) {
    background-position: -2.5rem center;
  }

  @media (min-width: 1024px) {
    background-position: left center;
  }
`;

const SecondaryCTAContent = styled.div`
  width: max-content;
  height: 100%;
  margin-left: auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  text-align: center;
  color: #ffffff;

  @media (min-width: 455px) {
    gap: 0;
  }

  @media (min-width: 769px) {
    gap: 1rem;
  }

  @media (min-width: 1024px) {
    gap: 0;
  }
`;

const SecondaryCTAHeading = styled.h4`
  margin: 0;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;

  @media (min-width: 455px) {
    font-size: 1.25rem;
  }

  @media (min-width: 769px) {
    font-size: 0.875rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.25rem;
  }
`;

const SecondaryCTASub = styled.p`
  margin: 0;
  font-style: italic;

  > * + * {
    margin-left: 0.5rem;
  }
`;

export { SecondaryCTAItem };

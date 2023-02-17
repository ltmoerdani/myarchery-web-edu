import * as React from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";

import IconChevronRight from "components/ma/icons/mono/chevron-right";

function SecondaryCTAItem({ bgImg, heading, subheading, title, to, onClick }) {
  const commonProps = {
    title: title || heading,
    style: {
      "--bg-image": `url(${bgImg})`,
      "--cursor-clickable": onClick ? "pointer" : undefined,
    },
  };

  if (to) {
    return (
      <Link to={to}>
        <SecondaryCTAItemWrapper {...commonProps}>
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
      </Link>
    );
  }

  return (
    <SecondaryCTAItemWrapper {...commonProps} onClick={onClick}>
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
  border: 12px solid var(--ma-blue-primary-50);
  background-color: var(--ma-blue-primary-50);
  background-image: var(--bg-image);
  background-repeat: no-repeat;
  background-position: -2.5rem center;
  background-size: contain;
  cursor: var(--cursor-clickable);
  color: #000;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.10);

  @media (min-width: 455px) {
    background-position: left center;
  }

  @media (min-width: 769px) {
    background-position: -2.5rem center;
  }

  @media (min-width: 1024px) {
    background-position: left center;
  }

  &:hover {
    border: 12px solid var(--ma-blue);
    background-color: var(--ma-blue);
    color: #ffffff;
  }
`;

const Link = styled(RouterLink)`
  display: block;
`;

const SecondaryCTAContent = styled.div`
  width: 100%;
  height: 100%;
  margin-left: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  text-align: center;

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

const SecondaryCTAHeading = styled.p`
  margin: 0;
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

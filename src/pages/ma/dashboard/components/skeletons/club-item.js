import React from "react";
import styled from "styled-components";

function SkeletonClubItem() {
  return (
    <StyledSkeleton>
      <div className="skeleton-logo">logo</div>
      <div className="skeleton-item-content">
        <div className="skeleton-item-heading">
          <h4>title</h4>
        </div>
        <div className="skeleton-info">info</div>
      </div>
      <div className="skeleton-item-action">
        <div className="skeleton-button-wide">action</div>
      </div>
    </StyledSkeleton>
  );
}

const StyledSkeleton = styled.div`
  position: relative;
  padding: 1.25rem;

  display: flex;
  gap: 1.25rem;

  animation: glowing 1.5s infinite;

  @keyframes glowing {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }

    to {
      opacity: 1;
    }
  }

  .skeleton-logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: solid 1px var(--ma-gray-100);
    background-color: var(--ma-gray-100);
    color: var(--ma-gray-100);
  }

  .skeleton-item-content {
    flex-grow: 1;
    padding-top: 0.875rem;

    .skeleton-item-heading {
      width: 300px;
      background-color: var(--ma-gray-100);
      > * {
        color: var(--ma-gray-100);
      }
    }

    .skeleton-info {
      width: 700px;
      background-color: var(--ma-gray-100);
      color: var(--ma-gray-100) !important;
    }
  }

  .skeleton-item-action {
    flex-shrink: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .skeleton-button-wide {
      display: inline-block;
      width: 120px;
      padding: 0.47rem 0.75rem;
      border-radius: 4px;
      border: solid 1px var(--ma-gray-100);
      background-color: var(--ma-gray-100);
      color: var(--ma-gray-100);
      font-size: 13px;
      line-height: 1.5;
    }
  }
`;

export { SkeletonClubItem };

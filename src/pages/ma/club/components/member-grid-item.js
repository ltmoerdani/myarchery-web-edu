import React from "react";
import styled from "styled-components";

function SkeletonMemberGridItem() {
  return (
    <StyledSkeletonItem>
      <div className="member-photo">
        <div className="member-photo-container">avatar</div>
      </div>

      <div className="member-detail">
        <h5 className="member-detail-name">name</h5>
        <div className="member-detail-gender">gender</div>
        <div className="member-detail-age">age</div>
      </div>
    </StyledSkeletonItem>
  );
}

const StyledSkeletonItem = styled.div`
  display: flex;
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

  .member-photo {
    .member-photo-container {
      overflow: hidden;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: var(--ma-gray-100);
      color: var(--ma-gray-100);
    }
  }

  .member-detail {
    flex-grow: 1;
    padding: 1rem;

    > * {
      background-color: var(--ma-gray-100);
      color: var(--ma-gray-100);
    }

    &-name {
      width: 90%;
    }

    &-gender,
    &-age {
      width: 60%;
    }
  }
`;

export { SkeletonMemberGridItem };

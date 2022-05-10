import * as React from "react";
import styled from "styled-components";

import user from "assets/icons/user.svg";

const AvatarWrapper = styled.div`
  overflow: hidden;
  min-width: var(--thumbnail-radius, 96px);
  min-height: var(--thumbnail-radius, 96px);
  border-radius: 50%;
  background-color: #efefef;

  display: flex;
  justify-content: center;
  align-items: center;

  .avatar-image {
    object-fit: cover;
    width: var(--thumbnail-radius, 96px);
    height: var(--thumbnail-radius, 96px);
  }

  .avatar-empty-container {
    width: 52px;
    height: 52px;
  }

  .avatar-empty-icon {
    width: 100%;
    height: 100%;
  }
`;

function Avatar({ size = "96px", imageSrc }) {
  if (!imageSrc) {
    return (
      <AvatarWrapper style={{ "--thumbnail-radius": size }}>
        <div className="avatar-empty-container">
          <img className="avatar-empty-icon" src={user} />
        </div>
      </AvatarWrapper>
    );
  }

  return (
    <AvatarWrapper style={{ "--thumbnail-radius": size }}>
      <div>
        <img className="avatar-image" src={imageSrc} />
      </div>
    </AvatarWrapper>
  );
}

export default Avatar;

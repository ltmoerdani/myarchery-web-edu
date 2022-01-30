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

  .avatar-empty-container {
    width: 52px;
    height: 52px;
  }

  .avatar-empty-icon {
    width: 100%;
    height: 100%;
  }
`;

function Avatar({ size = "96px" }) {
  // TODO: kondisional render foto user atau fallback ke icon avatar
  // ...
  return (
    <AvatarWrapper style={{ "--thumbnail-radius": size }}>
      <div className="avatar-empty-container">
        <img className="avatar-empty-icon" src={user} />
      </div>
    </AvatarWrapper>
  );
}

export default Avatar;

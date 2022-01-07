import * as React from "react";
import styled from "styled-components";

function AvatarClubDefault(props) {
  return <StyledAvatar {...props}>&#35;</StyledAvatar>; // #
}

const StyledAvatar = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--ma-gray-100);
  color: var(--ma-blue);
  font-size: 2rem;
  text-transform: uppercase;
  user-select: none;
`;

export { AvatarClubDefault };

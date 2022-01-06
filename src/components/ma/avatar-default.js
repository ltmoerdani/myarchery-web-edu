import * as React from "react";
import styled from "styled-components";

function AvatarDefault({ fullname }) {
  if (!fullname) {
    return <StyledAvatar>&#58;D</StyledAvatar>; // :D
  }

  const names = fullname.trim().toUpperCase().split(" ");
  if (names?.length === 1) {
    const firstInitial = names[0][0];
    return <StyledAvatar>{firstInitial}</StyledAvatar>;
  }
  if (names?.length > 1) {
    const firstInitial = names[0][0];
    const secondInitial = names[names.length - 1][0];
    return <StyledAvatar>{firstInitial + secondInitial}</StyledAvatar>;
  }
  return <StyledAvatar>&#58;D</StyledAvatar>; // :D
}

const StyledAvatar = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eef3fe;
  color: var(--ma-blue);
  font-size: 2rem;
  text-transform: uppercase;
  user-select: none;
`;

export { AvatarDefault };

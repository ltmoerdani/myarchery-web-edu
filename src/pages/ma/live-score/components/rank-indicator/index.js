import * as React from "react";
import styled from "styled-components";

import IconChevronUp from "components/ma/icons/mono/chevron-up";
import IconChevronDown from "components/ma/icons/mono/chevron-down";
import IconMinus from "components/ma/icons/mono/minus";

function RankIndicator({ direction: dir }) {
  const direction = Number(dir);

  if (direction > 0) {
    return (
      <Wrapper className="dir-up">
        <IconChevronUp size="20" />
      </Wrapper>
    );
  }
  if (direction < 0) {
    return (
      <Wrapper className="dir-down">
        <IconChevronDown size="20" />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <IconMinus size="20" />
    </Wrapper>
  );
}

const Wrapper = styled.span`
  display: inline-block;

  &.dir-up {
    color: var(--ma-green-400);
  }

  &.dir-down {
    color: #e11900;
  }
`;

export { RankIndicator };

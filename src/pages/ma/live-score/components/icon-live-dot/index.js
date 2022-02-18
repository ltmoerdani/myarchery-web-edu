import * as React from "react";
import styled from "styled-components";

import IconDot from "components/ma/icons/mono/dot";

function LiveIndicator() {
  return (
    <Wrapper>
      <span>
        <IconDot size="16" />
      </span>
      <span>Live Score</span>
    </Wrapper>
  );
}

const Wrapper = styled.span`
  display: inline-block;

  > * + * {
    margin-left: 0.5rem;
  }

  > * {
    display: inline-block;
  }

  > *:first-child {
    color: #f94f4f;
  }
`;

export { LiveIndicator };

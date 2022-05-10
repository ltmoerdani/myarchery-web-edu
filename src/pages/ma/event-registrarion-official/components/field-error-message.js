import * as React from "react";
import styled from "styled-components";

function FieldErrorMessage({ errors }) {
  if (!errors?.length) {
    return null;
  }
  const messages = errors.join(". ") + ".";
  return <StyledFieldErrorMessage>{messages}</StyledFieldErrorMessage>;
}

const StyledFieldErrorMessage = styled.div`
  margin-top: 0.5rem;
  color: var(--ma-red);
`;

export { FieldErrorMessage };

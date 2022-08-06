import * as React from "react";
import styled from "styled-components";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Button } from "components/ma";
import { toast } from "components/ma/processing-toast";

function ErrorBoundary({ children }) {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>;
}

function ErrorFallback({ error }) {
  return (
    <ErrorWrapper>
      <ErrorTitle>{error.name}</ErrorTitle>
      <ErrorMessage>{error.message}</ErrorMessage>

      <div>
        <Button
          title="Error stack trace"
          onClick={() => {
            navigator.clipboard.writeText(error.stack);
            toast.success("Stack trace di-copy ke clipboard");
          }}
        >
          Copy error
        </Button>
      </div>
    </ErrorWrapper>
  );
}

const ErrorWrapper = styled.div`
  padding: 1rem;
  border: 1px solid hotpink;
`;

const ErrorTitle = styled.h6`
  color: hotpink;
  font-weight: 600;
`;

const ErrorMessage = styled.pre`
  color: var(--ma-gray-600);
`;

export { ErrorBoundary, ErrorFallback };

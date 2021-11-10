import * as React from "react";
import styled from "styled-components";
import { Card, CardBody } from "reactstrap";

export default function CertificateEmptyListItem({ children }) {
  return (
    <Card className="rounded-2 bg-light border-secondary">
      <CardBody>
        <MessageBody className="text-center">
          <p className="text-muted">{children}</p>
        </MessageBody>
      </CardBody>
    </Card>
  );
}

const MessageBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  height: 200px;
`;

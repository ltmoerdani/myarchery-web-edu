import * as React from "react";
import { Card, CardBody } from "reactstrap";

export default function CertificateSkeleton() {
  return (
    <Card className="rounded-2">
      <svg
        width="100%"
        viewBox="0 0 1280 908"
        xmlns="http://www.w3.org/2000/svg"
        style={{ backgroundColor: "#f2f2f5" }}
      ></svg>
      <CardBody></CardBody>
    </Card>
  );
}

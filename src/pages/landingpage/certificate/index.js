import * as React from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";

import CertificateThumbnail from "./components/CertificateThumbnail";
import DownloadOverlay from "./components/DownloadOverlay";
import BadgeCertifType from "./components/BadgeCertifType";

import certificatesResponse from "./utils/mock-list-certificates.json";

export default function CertificatesPage() {
  const [certificates, setCertificates] = React.useState(null);

  React.useEffect(() => {
    setCertificates(certificatesResponse.data);
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="mb-5">
            <Col>
              <h1 className="text-center">Sertifikat Penghargaan</h1>
            </Col>
          </Row>

          <Row className="justify-content-center">
            {certificates?.map((certificate) => (
              <Col md="6" lg="4" key={certificate.data.id}>
                <Card className="rounded-2">
                  <CertificateThumbnail certificate={certificate} />

                  <CardBody>
                    <BadgeCertifType className="float-end">{certificate.type}</BadgeCertifType>
                  </CardBody>

                  <DownloadOverlay>
                    <Button tag="div" color="primary" className="tombol-download">
                      Download
                    </Button>
                  </DownloadOverlay>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

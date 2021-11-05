import * as React from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";

import HeaderForm from "layouts/landingpage/HeaderForm";
import { LoadingScreen } from "components";
import CertificateSkeleton from "./components/CertificateSkeleton";
import CertificateThumbnail from "./components/CertificateThumbnail";
import DownloadOverlay from "./components/DownloadOverlay";
import BadgeCertifType from "./components/BadgeCertifType";

import certificatesResponse from "./utils/mock-list-certificates.json";

export default function CertificatesPage() {
  const { event_id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [certificates, setCertificates] = React.useState(null);

  React.useEffect(() => {
    setCertificates(certificatesResponse.data);
      setLoading(true);
      setLoading(false);
  }, []);

  return (
    <React.Fragment>
      <HeaderForm />

      <Container fluid className="px-5 p-2">
        <LoadingScreen loading={loading} />

        <Row className="mt-5 mb-4">
          <Col>
            <h4 className="text-center">Sertifikat Penghargaan</h4>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {loading && !certificates?.length && (
            <Col md="6" lg="4">
              <CertificateSkeleton />
            </Col>
          )}

          {!loading && !certificates?.length && (
            <Col>
              <div className="text-center">
                <p>
                  Gagal memuat sertifikat
                  <br />
                  Silakan hubungi technical support
                </p>
              </div>
            </Col>
          )}

          {certificates?.map((certificate) => (
            <Col md="6" lg="4" key={certificate.data.id}>
              <Card className="rounded-2">
                <CertificateThumbnail certificate={certificate} />

                <CardBody>
                  <BadgeCertifType className="float-start">{certificate.type}</BadgeCertifType>
                </CardBody>

                <DownloadOverlay>
                  <Button
                    tag="div"
                    size="lg"
                    color="primary"
                    className="tombol-download"
                  >
                    Download
                  </Button>
                </DownloadOverlay>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </React.Fragment>
  );
}

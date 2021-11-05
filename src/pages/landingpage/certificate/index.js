import * as React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";
import { Certificate } from "services";

import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";

import HeaderForm from "layouts/landingpage/HeaderForm";
import { LoadingScreen } from "components";
import CertificateSkeleton from "./components/CertificateSkeleton";
import CertificateThumbnail from "./components/CertificateThumbnail";
import DownloadOverlay from "./components/DownloadOverlay";
import BadgeCertifType from "./components/BadgeCertifType";

export default function CertificatesPage() {
  const { event_id } = useParams();
  const [loading, setLoading] = React.useState(false);
  let { userProfile } = useSelector(getAuthenticationStore);
  const [certificates, setCertificates] = React.useState(null);

  React.useEffect(() => {
    const getCertifList = async () => {
      setLoading(true);

      const result = await Certificate.getListByEventMember({
        event_id: event_id,
        member_id: userProfile.id,
      });

      if (result.success || result.data) {
        setCertificates(result.data);
      }
      setLoading(false);
    };

    getCertifList();
  }, []);

  const handleDownloadSertif = async (typeCertificate) => {
    setLoading(true);
    await Certificate.download({
      event_id: event_id,
      member_id: userProfile.id,
      type_certificate: typeCertificate,
    });
    setLoading(false);
  };

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
                    onClick={() => handleDownloadSertif(certificate.data.typeCertificate)}
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

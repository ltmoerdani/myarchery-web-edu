import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useCertificateDownload } from "../hooks/certificate-download";

import { Modal, ModalBody } from "reactstrap";
import { Button, ButtonBlue, LoadingScreen } from "components/ma";

import IconCertificate from "components/ma/icons/color/certificate";
import IconDownload from "components/ma/icons/mono/download";

function TabDokumen({ certificateState }) {
  const { data: certificates, isLoading: isLoadingCertificates } = certificateState;

  const { order_id } = useParams();
  const orderId = parseInt(order_id);
  const { handleCertificateDownload, isLoading: isLoadingDownload } = useCertificateDownload();

  const getCertificateTypeLabel = (type) => {
    const labels = {
      1: "Peserta",
      2: "Juara Eliminasi",
      3: "Peserta Eliminasi",
    };
    return labels[type];
  };

  return (
    <React.Fragment>
      <PanelContainer>
        <GridCardWannabe>
          {!certificates && isLoadingCertificates ? (
            <div>Sedang memuat data sertifikat...</div>
          ) : certificates ? (
            certificates.length ? (
              certificates.map((certificate) => (
                <CardDocItem key={certificate.data.id}>
                  <div>
                    <DocItemTitle>
                      <span>
                        <IconCertificate />
                      </span>
                      <span>Sertifikat {getCertificateTypeLabel(certificate.type)}</span>
                    </DocItemTitle>
                  </div>

                  <div>
                    <CertificatePreviewer certificateData={certificate.data} />

                    <ButtonBlueDownload
                      onClick={() => {
                        handleCertificateDownload(orderId, certificate.data.typeCertificate);
                      }}
                    >
                      <span>
                        <IconDownload size="16" />
                      </span>
                      <span>Unduh</span>
                    </ButtonBlueDownload>
                  </div>
                </CardDocItem>
              ))
            ) : (
              <div>Belum memiliki sertifikat di kategori ini</div>
            )
          ) : (
            <div>Belum memiliki sertifikat di kategori ini</div>
          )}
        </GridCardWannabe>
      </PanelContainer>

      <LoadingScreen
        loading={isLoadingDownload}
        message={
          <React.Fragment>
            Sedang menyiapkan berkas sertifikat.
            <br />
            Mohon jangan tutup jendela dan tunggu sejenak...
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}

function CertificatePreviewer({ certificateData }) {
  const [isOpen, setOpen] = React.useState(false);

  const modalProps = {
    isOpen: true,
    size: "lg",
    centered: true,
    toggle: () => setOpen((open) => !open),
    onClosed: () => setOpen(false),
  };

  return (
    <React.Fragment>
      <ButtonPreview onClick={() => setOpen(true)}>
        <span>
          <IconPreview size="16" />
        </span>
        <span>Pratinjau</span>
      </ButtonPreview>

      {isOpen && (
        <StyledBSModal {...modalProps}>
          <StyledBSModalBody>
            <CertificateThumbnail templateData={certificateData} />

            <div className="float-end mt-3">
              <ButtonBlue onClick={modalProps.onClosed}>Tutup</ButtonBlue>
            </div>
          </StyledBSModalBody>
        </StyledBSModal>
      )}
    </React.Fragment>
  );
}

const CertificateThumbnail = ({ templateData }) => {
  const { editorData } = templateData;
  const { fields } = editorData;

  return (
    <svg
      width="100%"
      viewBox="0 0 1280 908"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        backgroundImage: `url(${editorData.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      preserveAspectRatio="xMidYMin slice"
    >
      <ThumbnailTextField field={fields[0]}>{templateData.memberName}</ThumbnailTextField>

      {parseInt(templateData.typeCertificate) === 2 && (
        <ThumbnailTextField field={fields[1]}>Juara {templateData.ranked}</ThumbnailTextField>
      )}

      <ThumbnailTextField field={fields[2]}>{templateData.categoryName}</ThumbnailTextField>
    </svg>
  );
};

const ThumbnailTextField = ({ children, field }) => {
  return (
    <text
      textAnchor="middle"
      dominantBaseline="hanging"
      x={field.x}
      y={field.y + 5}
      fontSize={field.fontSize}
      fontFamily={field.fontFamily}
      fontWeight={field.fontWeight}
      fill={field.color}
    >
      {children}
    </text>
  );
};

const StyledBSModal = styled(Modal)`
  .modal-content {
    border-radius: 1.25rem;
  }
`;

const StyledBSModalBody = styled(ModalBody)`
  padding: 1.5rem 1.25rem;
`;

const PanelContainer = styled.div`
  padding: 1.5rem;

  > * + * {
    margin-top: 2.25rem;
  }
`;

const GridCardWannabe = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem 1rem;

  @media (min-width: 361px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (min-width: 961px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CardDocItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem 0.5rem;

  @media (min-width: 361px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  padding: 1rem;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px 0.25px rgba(0, 0, 0, 0.075);

  > *:first-child {
    flex-grow: 1;
    flex-basis: 50%;
    margin: auto 0;
    text-align: center;

    @media (min-width: 361px) {
      text-align: left;
    }
  }

  > *:last-child {
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.5rem;

    @media (min-width: 361px) {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
`;

const DocItemTitle = styled.h5`
  margin: 0;
  font-weight: 600;

  > span + span {
    margin-left: 0.5rem;
  }

  > span {
    display: inline-block;
  }
`;

const ButtonPreview = styled(Button)`
  > span + span {
    margin-left: 0.5rem;
  }
`;

const ButtonBlueDownload = styled(ButtonBlue)`
  > span + span {
    margin-left: 0.5rem;
  }
`;

function IconPreview({ size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
    </svg>
  );
}

export { TabDokumen };

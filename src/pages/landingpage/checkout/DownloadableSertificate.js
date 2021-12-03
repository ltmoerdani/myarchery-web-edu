import * as React from "react";
import styled from "styled-components";

import { Button } from "reactstrap";
import CertificateThumbnail from "./CertificateThumbnail";

const DownloadOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 0.15s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);

    .tombol-download {
      visibility: visible;
    }
  }

  .tombol-download {
    visibility: hidden;
  }
`;

function ButtonDownloadHoverable({ children = "Download", onClick }) {
  const handleClick = () => onClick?.();
  return (
    <DownloadOverlay>
      <Button
        tag="div"
        size="md"
        color="primary"
        className="tombol-download"
        style={{ backgroundColor: "#0d47a1" }}
        onClick={handleClick}
      >
        {children}
      </Button>
    </DownloadOverlay>
  );
}

const BadgeCertifType = styled.div`
  padding: 0.28rem 0.8rem;
  border-radius: 0.5rem;

  background-color: #ffff99;
  color: var(--bs-orange);

  text-transform: capitalize;
  font-size: 0.8em;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  vertical-align: middle;
`;

export default function DownloadableCertificate({ certificate, onDownload }) {
  const handleClickDownload = () => onDownload?.();
  return (
    <div>
      <div className="position-relative mb-3">
        <CertificateThumbnail certificate={certificate} />
        <ButtonDownloadHoverable onClick={handleClickDownload} />
      </div>
      <BadgeCertifType className="float-start">{certificate.type}</BadgeCertifType>
    </div>
  );
}

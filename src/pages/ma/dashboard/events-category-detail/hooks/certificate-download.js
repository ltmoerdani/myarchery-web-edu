import * as React from "react";
import { useFetcher } from "hooks/fetcher-alt";
import { Certificate } from "services";

import fileSaver from "file-saver";

function useParticipantCertificates(participantId) {
  const certificates = useFetcher();

  React.useEffect(() => {
    if (!participantId) {
      return;
    }

    certificates.runAsync(
      () => {
        return Certificate.getByParticipantId({ participant_id: participantId });
      },
      {
        transform: (data) => {
          return data.map((certificate) => ({
            ...certificate,
            data: { ...certificate.data, editorData: JSON.parse(certificate.data.editorData) },
          }));
        },
      }
    );
  }, [participantId]);

  return certificates;
}

function useCertificateDownload() {
  const certificateDownload = useFetcher();

  const handleCertificateDownload = async (participantId, typeCertificate) => {
    if (!participantId || !typeCertificate) {
      return;
    }

    certificateDownload.runAsync(
      () => {
        return Certificate.download({
          participant_id: participantId,
          type_certificate: typeCertificate,
        });
      },
      {
        onSuccess(data) {
          certificateDownload.setLoading();
          const { fileName, fileBase64 } = data;
          fileSaver.saveAs(fileBase64, fileName || "certificate.pdf");
          certificateDownload.setSuccess();
        },
      }
    );
  };

  return { ...certificateDownload, handleCertificateDownload };
}

export { useParticipantCertificates, useCertificateDownload };

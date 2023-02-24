import * as React from "react";
import styled from "styled-components";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";

import IconAlertTriangle from "components/ma/icons/mono/alert-triangle";
import { useHistory } from "react-router-dom";

function AlertServerError({ isError, errors, onConfirm }) {
  const history = useHistory();
  const [isOpen, setOpen] = React.useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm?.();
  };

  React.useEffect(() => {
    if (!isError) {
      return;
    }
    setOpen(true);
  }, [isError]);

  const userHasRegisterEvent = errors?.includes(
    "user telah mendaftar kategori ini"
  );

  return (
    <React.Fragment>
      <SweetAlert
        show={isOpen}
        title=""
        custom
        btnSize="md"
        style={{ padding: "30px 40px", width: "720px" }}
        onConfirm={handleConfirm}
        customButtons={
          <span className="d-flex flex-column w-100">
            {userHasRegisterEvent ? (
              <Button
                style={{ marginBottom: 10 }}
                onClick={() => history.replace("/dashboard/list-transaction")}
              >
                Lihat Transaksi
              </Button>
            ) : null}
            <ButtonBlue onClick={handleConfirm}>Tutup</ButtonBlue>
          </span>
        }
      >
        <AlertBodyWrapper>
          <h4>
            <IconAlertTriangle />
          </h4>

          {!userHasRegisterEvent ? (
            <p>
              Terdapat kendala teknis dalam memproses data. Coba kembali
              beberapa saat lagi, atau silakan berikan pesan error berikut
              kepada technical support:
            </p>
          ) : (
            <p>Tidak bisa melanjutkan proses pendaftaran. Alasan: </p>
          )}

          <PreformatedErrorMessages className="p-3">
            {renderErrorMessages(errors)}
          </PreformatedErrorMessages>
        </AlertBodyWrapper>
      </SweetAlert>
    </React.Fragment>
  );
}

/* =================================== */
// styles

const AlertBodyWrapper = styled.div`
  > * + * {
    margin-top: 1rem;
  }

  > *:not(:nth-child(1)) {
    text-align: left;
  }
`;

const PreformatedErrorMessages = styled.pre`
  background-color: var(--ma-gray-100);
  white-space: pre-wrap;
  word-wrap: break-word;
`;

/* =================================== */
// utils

const renderErrorMessages = (errors) => {
  if (errors && typeof errors === "string") {
    return errors;
  }

  if (errors) {
    const fields = Object.keys(errors);
    const messages = fields.map(
      (field) =>
        `${errors[field].map((message) => `- ${message}\n\n`).join("")}`
    );

    if (messages.length) {
      return `${messages.join("")}`;
    }
  }

  return "Error tidak diketahui.";
};

export { AlertServerError };

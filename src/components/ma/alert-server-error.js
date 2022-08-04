import * as React from "react";
import styled from "styled-components";

import SweetAlert from "react-bootstrap-sweetalert";
import { ButtonBlue } from "components/ma";

import IconAlertTriangle from "components/ma/icons/mono/alert-triangle";

function AlertServerError({ isError, errors, onConfirm }) {
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
            <ButtonBlue onClick={handleConfirm}>Tutup</ButtonBlue>
          </span>
        }
      >
        <AlertBodyWrapper>
          <h4>
            <IconAlertTriangle />
          </h4>

          <p>
            Terdapat kendala teknis dalam memproses data. Coba kembali beberapa saat lagi, atau
            silakan berikan pesan error berikut kepada technical support:
          </p>

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
      (field) => `${errors[field].map((message) => `- ${message}\n\n`).join("")}`
    );

    if (messages.length) {
      return `${messages.join("")}`;
    }
  }

  return "Error tidak diketahui.";
};

export { AlertServerError };

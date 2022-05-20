import * as React from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { ArcherService } from "services";

import { AvField, AvForm } from "availity-reactstrap-validation";
import SweetAlert from "react-bootstrap-sweetalert";
import { ButtonBlue } from "components/ma";

// ! Legacy, need refactoring...
function PasswordResetForm() {
  const { push } = useHistory();

  const [confirm, setConfirm] = React.useState(false);
  const [faild, setFaild] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const onFaildClikOk = () => setFaild(false);

  const handleGoVerification = () => push(`/archer/verification/${email}`);

  const handleValidSubmit = async (event, values) => {
    setEmail(values.email);

    const { data, message } = await ArcherService.forgotPassword(values);

    if (!data) {
      setMessage(message);
      setFaild(true);
    }

    if (data) {
      setConfirm(true);
    }
  };

  return (
    <React.Fragment>
      <AvForm
        className="form-horizontal"
        onValidSubmit={(e, v) => {
          handleValidSubmit(e, v);
        }}
      >
        <div className="mb-3">
          <AvField
            name="email"
            label="Email"
            className="form-control"
            placeholder="Masukkan email"
            type="email"
            required
            errorMessage="email belum diisi"
          />
        </div>

        <div className="mt-3">
          <ButtonBlue block type="submit">
            Kirim
          </ButtonBlue>
        </div>

        <div className="mt-5 text-center">
          <p>
            Batal ubah?{" "}
            <TextLink to="/archer/login" className="fw-medium">
              Masuk di sini
            </TextLink>
          </p>
        </div>
      </AvForm>

      <SweetAlert
        title=""
        show={confirm}
        custom
        btnSize="md"
        reverseButtons={true}
        confirmBtnText="Ya"
        confirmBtnBsStyle="outline-primary"
        cancelBtnBsStyle="primary"
        onConfirm={handleGoVerification}
        style={{ padding: "30px 40px" }}
      >
        <p className="text-muted">
          Kode berhasil dikirim ke alamat email anda.
          <br />
          <small>Check spam jika tidak ada</small>
        </p>
      </SweetAlert>

      <SweetAlert
        title=""
        show={faild}
        custom
        btnSize="md"
        reverseButtons={true}
        confirmBtnText="Ya"
        confirmBtnBsStyle="outline-primary"
        cancelBtnBsStyle="primary"
        onConfirm={onFaildClikOk}
        style={{ padding: "30px 40px" }}
      >
        <p className="text-muted">{message}</p>
      </SweetAlert>
    </React.Fragment>
  );
}

const TextLink = styled(Link)`
  color: var(--ma-blue);
`;

export { PasswordResetForm };

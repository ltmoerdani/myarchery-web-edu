import * as React from "react";
import { useHistory } from "react-router-dom";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";

import logoBuatAkun from "assets/images/myachery/Illustration.png";

function VerificationStatusAlert({ isAlertOpen, verifyStatus, reasonRejected, onCancel }) {
  const history = useHistory();

  // Memastikan nilai yang dicek integer
  verifyStatus = verifyStatus ? parseInt(verifyStatus) : verifyStatus;

  const onConfirm = () => {
    history.push("/dashboard/profile/verifikasi");
  };

  if (verifyStatus === 4) {
    return (
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        onConfirm={onConfirm}
        style={{ padding: "1.25rem" }}
        customButtons={
          <span className="d-flex w-100 justify-content-center" style={{ gap: "0.5rem" }}>
            <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
              Nanti Saja
            </Button>
            <ButtonBlue onClick={onConfirm}>Ya, lengkapi data</ButtonBlue>
          </span>
        }
      >
        <div className="d-flex justify-content-center flex-column">
          <div style={{ width: "60%", margin: "0 auto" }}>
            <div style={{ width: "214px", height: "145px" }}>
              <img src={logoBuatAkun} width="100%" height="100%" style={{ objectFit: "cover" }} />
            </div>
          </div>
          <span
            style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24px" }}
            className="mt-3"
          >
            Verifikasi Akun
          </span>
          <p>
            Akun Anda belum terverifikasi. Silakan lengkapi data untuk dapat mengikuti berbagai
            event panahan.
          </p>
        </div>
      </SweetAlert>
    );
  }

  if (verifyStatus === 2) {
    return (
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        onConfirm={onConfirm}
        style={{ padding: "1.25rem" }}
        customButtons={
          <span className="d-flex w-100 justify-content-center" style={{ gap: "0.5rem" }}>
            <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
              Nanti Saja
            </Button>
            <ButtonBlue onClick={onConfirm}>Ya, lengkapi data</ButtonBlue>
          </span>
        }
      >
        <div className="d-flex justify-content-center flex-column">
          <div style={{ width: "60%", margin: "0 auto" }}>
            <div style={{ width: "214px", height: "145px" }}>
              <img src={logoBuatAkun} width="100%" height="100%" style={{ objectFit: "cover" }} />
            </div>
          </div>
          <span
            style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24px" }}
            className="mt-3"
          >
            Verifikasi Akun
          </span>
          <p>
            Proses verifikasi Anda hampir selesai,
            <br />
            <span>{reasonRejected}</span>
          </p>
        </div>
      </SweetAlert>
    );
  }

  return null;
}

export { VerificationStatusAlert };

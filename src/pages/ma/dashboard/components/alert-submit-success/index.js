import * as React from "react";

import SweetAlert from "react-bootstrap-sweetalert";
import { ButtonBlue } from "components/ma";

function AlertSubmitSuccess({ children, isSuccess, onConfirm }) {
  const [isAlertOpen, setAlertOpen] = React.useState(false);

  const handleConfirm = () => {
    setAlertOpen(false);
    onConfirm?.();
  };

  React.useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setAlertOpen(true);
  }, [isSuccess]);

  return (
    <React.Fragment>
      <SweetAlert
        show={isAlertOpen}
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
        <p>{children}</p>
      </SweetAlert>
    </React.Fragment>
  );
}

export { AlertSubmitSuccess };

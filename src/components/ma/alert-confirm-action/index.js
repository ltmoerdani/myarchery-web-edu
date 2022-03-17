import * as React from "react";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";

function AlertConfirmAction({
  children,
  shouldConfirm,
  onConfirm,
  onClose,
  labelCancel = "Batal",
  labelConfirm = "Konfirmasi",
  reverseActions = false,
}) {
  const [isAlertOpen, setAlertOpen] = React.useState(false);

  const handleConfirm = () => {
    onConfirm?.();
    setAlertOpen(false);
    onClose?.();
  };

  const handleCancel = () => {
    setAlertOpen(false);
    onClose?.();
  };

  React.useEffect(() => {
    if (!shouldConfirm) {
      return;
    }
    setAlertOpen(true);
  }, [shouldConfirm]);

  return (
    <React.Fragment>
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        style={{ padding: "30px 40px", width: "520px" }}
        onConfirm={handleConfirm}
        customButtons={
          <span className="d-flex flex-column justify-content-center" style={{ gap: "0.5rem" }}>
            <Button
              style={{ minWidth: 120 }}
              onClick={reverseActions ? handleConfirm : handleCancel}
            >
              {reverseActions ? labelConfirm : labelCancel}
            </Button>

            <ButtonBlue
              style={{ minWidth: 120 }}
              onClick={reverseActions ? handleCancel : handleConfirm}
            >
              {reverseActions ? labelCancel : labelConfirm}
            </ButtonBlue>
          </span>
        }
      >
        <div>
          <p>{children}</p>
        </div>
      </SweetAlert>
    </React.Fragment>
  );
}

export { AlertConfirmAction };

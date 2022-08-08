import * as React from "react";
import styled from "styled-components";
import { useUserProfile } from "hooks/user-profile";
import { useHistory } from "react-router-dom";
import { useSubmitVerification } from "../hooks/submit-verification";
import { useSubmitOrder } from "../hooks/submit-order";

import CurrencyFormat from "react-currency-format";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  ButtonBlue,
  Button,
  AlertSubmitError,
  LoadingScreen,
  SpinnerDotBlock,
} from "components/ma";
import { toast } from "components/ma/processing-toast";

import IconAlertTriangle from "components/ma/icons/mono/alert-triangle";

import { checkIsIndividu } from "../utils";

function TicketView({
  isLoadingEventDetail,
  eventDetailData,
  wizardView,
  formVerification,
  formOrder,
  onSuccessVerification,
  onSuccessOrder,
}) {
  const history = useHistory();
  const { userProfile } = useUserProfile();

  const { currentStep, goToNextStep, goToPreviousStep } = wizardView;

  const {
    submit: submitVerification,
    isLoading: isLoadingVerification,
    isError: isErrorVerification,
    errors: errorVerification,
  } = useSubmitVerification(formVerification.data);

  const { data: formData, handleValidation } = formOrder;
  const { category } = formData;

  const {
    submit,
    reset,
    isLoading: isLoadingSubmit,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useSubmitOrder(formData);

  const participantCounts = _getParticipantCounts(category);

  const handleClickNext = () => {
    const onValidOrder = () => {
      const isVerificationDone = _checkIsVerificationDone(userProfile?.verifyStatus);
      if (!isVerificationDone) {
        submitVerification({
          onSuccess: () => {
            onSuccessVerification?.();
            goToNextStep();
          },
        });
      } else {
        goToNextStep();
      }
    };
    const onInvalidOrder = () => toast.error("Mohon koreksi form terlebih dulu agar terisi benar");
    handleValidation(onValidOrder, onInvalidOrder);
  };

  const handleSubmitOrder = () => {
    const options = {
      onSuccess: (data) => {
        onSuccessOrder?.();
        const orderId = data?.archeryEventParticipantId;
        orderId && history.push("/dashboard/transactions/" + orderId);
      },
    };
    submit(options);
  };

  if (isLoadingEventDetail) {
    return (
      <TicketCard>
        <SpinnerDotBlock />
      </TicketCard>
    );
  }

  if (eventDetailData) {
    return (
      <React.Fragment>
        <TicketCard>
          <h4 className="mb-3">Tiket Lomba</h4>

          <EventMediaObject>
            <div>
              <span
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  width: 60,
                  height: 60,
                  borderRadius: 4,
                }}
              >
                <img
                  src={eventDetailData?.publicInformation.eventBanner}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </span>
            </div>

            <EventMediaObjectContent>
              <h5>{eventDetailData?.publicInformation.eventName}</h5>
              <p className="mb-0">{eventDetailData?.publicInformation.eventLocation}</p>
            </EventMediaObjectContent>
          </EventMediaObject>

          <TicketDivider />

          <TicketSectionDetail>
            <DetailItem
              label="Jenis Regu"
              value={category?.teamCategoryDetail?.label || category?.teamCategoryId}
            />

            <DetailItem label="Kategori" value={category?.categoryLabel} />

            <DetailItem
              label="Jumlah Peserta"
              value={participantCounts && participantCounts + " Orang"}
            />
          </TicketSectionDetail>

          <div className="d-flex flex-column justify-content-between">
            <TicketSectionTotal>
              <div>
                <LabelTotal>Total Pembayaran</LabelTotal>
              </div>
              <div>
                {category?.isEarlyBird ? (
                  <React.Fragment>
                    <UndiscountedTotalWithCurrency value={_getPriceNumber(category?.fee)} />
                    <TotalWithCurrency value={_getPriceNumber(category?.earlyBird)} />
                  </React.Fragment>
                ) : (
                  <TotalWithCurrency value={_getPriceNumber(category?.fee)} />
                )}
              </div>
            </TicketSectionTotal>

            {currentStep === 1 ? (
              <React.Fragment>
                <ButtonBlue disabled={!category} onClick={handleClickNext}>
                  Selanjutnya
                </ButtonBlue>
                <AlertSubmitError isError={isErrorVerification} errors={errorVerification} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ButtonConfirmPayment
                  onConfirm={() => handleSubmitOrder()}
                  onCancel={() => goToPreviousStep()}
                />
                <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} onConfirm={reset} />
              </React.Fragment>
            )}
          </div>
        </TicketCard>

        <LoadingScreen loading={isLoadingSubmit || isLoadingVerification} />
      </React.Fragment>
    );
  }

  return <TicketCard>Ada kesalahan dalam memuat data.</TicketCard>;
}

function DetailItem({ label, value }) {
  if (!value) {
    return (
      <div>
        <DetailLabel>{label}</DetailLabel>
        <DetailValue muted>&ndash;</DetailValue>
      </div>
    );
  }

  return (
    <div>
      <DetailLabel>{label}</DetailLabel>
      <DetailValue>{value}</DetailValue>
    </div>
  );
}

function UndiscountedTotalWithCurrency({ value }) {
  return (
    <CurrencyFormat
      style={{ textDecoration: "line-through" }}
      className="me-2"
      displayType={"text"}
      value={value}
      prefix="Rp"
      thousandSeparator={"."}
      decimalSeparator={","}
      decimalScale={0}
      fixedDecimalScale
    />
  );
}

function TotalWithCurrency({ value }) {
  return (
    <StyledTotalWithCurrency
      displayType={"text"}
      value={value}
      prefix="Rp"
      thousandSeparator={"."}
      decimalSeparator={","}
      decimalScale={0}
      fixedDecimalScale
    />
  );
}

function ButtonConfirmPayment({ onConfirm, onCancel }) {
  const [isAlertOpen, setAlertOpen] = React.useState(false);

  const handleConfirmSubmit = () => {
    setAlertOpen(false);
    onConfirm?.();
  };

  const handleCancelSubmit = () => {
    setAlertOpen(false);
    onCancel?.();
  };

  return (
    <React.Fragment>
      <ButtonBlue onClick={() => setAlertOpen(true)}>Lanjutkan Pembayaran</ButtonBlue>
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        onConfirm={handleConfirmSubmit}
        style={{ padding: "1.25rem" }}
        customButtons={
          <span className="d-flex flex-column w-100" style={{ gap: "0.5rem" }}>
            <Button onClick={handleCancelSubmit} style={{ color: "var(--ma-blue)" }}>
              Cek Kembali
            </Button>
            <ButtonBlue onClick={handleConfirmSubmit}>Benar</ButtonBlue>
          </span>
        }
      >
        <p style={{ color: "var(--ma-orange-300)" }}>
          <IconAlertTriangle size="36" />
        </p>
        <p>
          Pastikan data Anda sudah benar. Penyelenggara dapat mendiskualifikasi Anda dari
          pertandingan jika data tidak sesuai.
        </p>
      </SweetAlert>
    </React.Fragment>
  );
}

/* ================================ */
// styles

const TicketCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  padding-bottom: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow: 0px 7.84391px 15.6878px rgba(18, 38, 63, 0.0313726);
`;

const EventMediaObject = styled.div`
  display: flex;
  gap: 1rem;
`;

const EventMediaObjectContent = styled.div`
  flex: 1 1 0%;
  margin: auto;
`;

const TicketDivider = styled.hr`
  margin: 2rem 0;
`;

const TicketSectionDetail = styled.div`
  margin-bottom: 4rem;
`;

const DetailLabel = styled.h6`
  font-weight: 400;
`;

const isTextMuted = ({ muted }) => (muted ? "color: var(--ma-gray-400);" : "");

const DetailValue = styled.p`
  font-size: 15px;
  font-weight: 600;
  text-transform: capitalize;
  ${isTextMuted}
`;

const TicketSectionTotal = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const LabelTotal = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const StyledTotalWithCurrency = styled(CurrencyFormat)`
  color: var(--ma-blue);
  font-size: 18px;
  font-weight: 600;
`;

/* ==================================== */
// utils

function _getPriceNumber(price) {
  return price ? Number(price) : 0;
}

function _getParticipantCounts(category) {
  if (!category) {
    return 0;
  }

  const isCategoryIndividu = checkIsIndividu(category);
  if (isCategoryIndividu) {
    return 1;
  }

  if (category.teamCategoryId === "mix_team") {
    return 2;
  }

  return 3;
}

/**
 * Verifikasi tidak diminta lagi ketika statusnya "terverifikasi" (kode 1)
 * atau "menunggu diverifikasi" (kode 3). Status lainnya akan tetap ditawarkan
 * form untuk isi data verifikasi user.
 * @param {int} verifyStatus 1 | 2 | 3 | 4
 * @returns {Boolean}
 */
function _checkIsVerificationDone(verifyStatus) {
  const acceptedStatuses = [1, 3];
  return acceptedStatuses.indexOf(verifyStatus) > -1;
}

export { TicketView };

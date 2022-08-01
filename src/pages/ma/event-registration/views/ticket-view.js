import * as React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
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

import { checkIsIndividu } from "../utils";

function TicketView({ isLoadingEventDetail, eventDetailData, wizardView, formOrder }) {
  const history = useHistory();
  const { currentStep, goToNextStep, goToPreviousStep } = wizardView;
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

  const handleClickNext = () => handleValidation(goToNextStep);

  const handleSubmitOrder = () => {
    const options = {
      onSuccess: (data) => {
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
              <ButtonBlue onClick={handleClickNext}>Selanjutnya</ButtonBlue>
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

        <LoadingScreen loading={isLoadingSubmit} />
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
            <ButtonBlue onClick={handleConfirmSubmit}>Sudah Benar</ButtonBlue>
          </span>
        }
      >
        <p>Apakah data pemesanan Anda sudah benar?</p>
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

export { TicketView };

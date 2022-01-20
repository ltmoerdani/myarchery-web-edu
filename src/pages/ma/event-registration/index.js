import * as React from "react";
import styled from "styled-components";
import { useWizardView } from "hooks/wizard-view";

import MetaTags from "react-meta-tags";
import { Container as BSContainer, Modal, ModalBody } from "reactstrap";
import { WizardView, WizardViewContent, ButtonBlue } from "components/ma";
import { BreadcrumbDashboard } from "../dashboard/components/breadcrumb";

import classnames from "classnames";

const tabList = [
  { step: 1, label: "Pendaftaran" },
  { step: 2, label: "Pemesanan" },
];

function PageEventRegistration() {
  const { currentStep, goToNextStep, goToStep } = useWizardView(tabList);

  const breadcrumpCurrentPageLabel = "Pendaftaran {eventName}";

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Pendaftaran Event {"{eventName}"} | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="/dashboard">{breadcrumpCurrentPageLabel}</BreadcrumbDashboard>

        <StepIndicator>
          <Step
            className={classnames({
              "step-active": currentStep === 1,
              "step-done": currentStep > 1,
            })}
            onClick={() => currentStep > 1 && goToStep(1)}
          >
            1. Pendaftaran
          </Step>
          <StepArrow>&#10097;</StepArrow>
          <Step className={classnames({ "step-active": currentStep === 2 })}>2. Pemesanan</Step>
        </StepIndicator>

        <SplitDisplay>
          <div>
            <WizardView currentStep={currentStep}>
              <WizardViewContent noContainer>
                <ContentCard>
                  <div className="d-flex">
                    <div>
                      <span>{"{icon}"}</span>
                    </div>
                    <h4>Detail Pendaftaran</h4>
                  </div>

                  <div className="d-flex flex-column">
                    <label>Kategori Lomba</label>
                    <EventCategoryPicker
                    />
                  </div>

                  <div className="d-flex flex-column">
                    <label>Nama Pendaftar</label>
                    <input disabled />
                  </div>

                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-column">
                      <label>Email</label>
                      <input disabled />
                    </div>

                    <div className="d-flex flex-column">
                      <label>No. Telepon</label>
                      <input disabled />
                    </div>
                  </div>

                  <div>
                    <h5>Data Peserta</h5>
                    <p>Masukkan email peserta yang telah terdaftar</p>
                  </div>

                  <div className="d-flex flex-column">
                    <label>Nama Klub</label>
                    <ClubPicker />
                    <span>Dapat dikosongkan jika tidak mewakili klub</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-end">
                    <div className="d-flex flex-column">
                      <label>Peserta</label>
                      <input />
                    </div>

                    <div>
                      <label>Sama dengan pendaftar</label>
                      <span>{"<SwitchToggle />"}</span>
                    </div>
                  </div>
                </ContentCard>
              </WizardViewContent>

              <WizardViewContent noContainer>
                <ContentCard>
                  <div className="d-flex">
                    <div>
                      <span>{"{icon}"}</span>
                    </div>
                    <h4>Detail Pendaftar</h4>
                  </div>
                </ContentCard>

                <ContentCard>
                  <ClubDetailLabel>Nama Klub</ClubDetailLabel>
                  <ClubDetailValue>{"{clubName}"}</ClubDetailValue>
                </ContentCard>

                <ParticipantCard>
                  <ParticipantHeadingLabel>Data Peserta</ParticipantHeadingLabel>

                  <EventMediaObject>
                    <div>
                      <span>{"{src=avatar}"}</span>
                    </div>

                    <div>
                      <h5>{"{name}"}</h5>
                      <p>{"{email}"}</p>
                      <div className="d-flex">
                        <p>{"{gender}"}</p>
                        <p>{"{age}"}</p>
                      </div>
                    </div>
                  </EventMediaObject>
                </ParticipantCard>

                <ParticipantCard>
                  <ParticipantHeadingLabel>Data Peserta</ParticipantHeadingLabel>

                  <EventMediaObject>
                    <div>
                      <span>{"{src=avatar}"}</span>
                    </div>

                    <div>
                      <h5>{"{name}"}</h5>
                      <p>{"{email}"}</p>
                      <div className="d-flex">
                        <p>{"{gender}"}</p>
                        <p>{"{age}"}</p>
                      </div>
                    </div>
                  </EventMediaObject>
                </ParticipantCard>
              </WizardViewContent>
            </WizardView>
          </div>

          <div>
            <TicketCard>
              <h4>Tiket Lomba</h4>

              <EventMediaObject>
                <div>
                  <span>{"{src=eventBanner}"}</span>
                </div>

                <div>
                  <h5>{"{eventName}"}</h5>
                  <p>{"{eventLocation}"}</p>
                </div>
              </EventMediaObject>

              <TicketDivider />

              <TicketSectionDetail>
                <div>
                  <DetailLabel>Jenis Regu</DetailLabel>
                  <DetailValue>{"{teamCategory}"}</DetailValue>
                </div>

                <div>
                  <DetailLabel>Kategori</DetailLabel>
                  <DetailValue>{"{categoryName}"}</DetailValue>
                </div>

                <div>
                  <DetailLabel>Jumlah Peserta</DetailLabel>
                  <DetailValue>{"{participantCounts}"}</DetailValue>
                </div>
              </TicketSectionDetail>

              <div className="d-flex flex-column justify-content-between">
                <TicketSectionTotal>
                  <LabelTotal>Total Pembayaran</LabelTotal>
                  <TotalAmount>Rp{"{fee}"}</TotalAmount>
                </TicketSectionTotal>

                {currentStep === 1 ? (
                  <ButtonBlue onClick={() => goToNextStep()}>Selanjutnya</ButtonBlue>
                ) : (
                  <ButtonBlue
                    onClick={() => {
                      alert("Apakah data pemesanan Anda sudah benar?");
                      // TODO: alert konfirmasi
                    }}
                  >
                    Lanjutkan Pembayaran
                  </ButtonBlue>
                )}
              </div>
            </TicketCard>
          </div>
        </SplitDisplay>
      </Container>
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  font-family: "Inter", sans-serif;
`;

const Container = styled(BSContainer)`
  margin-bottom: 5rem;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding: 6px 0.75rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const Step = styled.span`
  flex-basis: 100%;
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 600;

  &.step-active {
    background-color: var(--ma-blue-primary-50);
    color: var(--ma-blue);
    font-weight: 600;
  }

  &.step-done {
    cursor: pointer;
    background-color: var(--ma-blue-primary-50);
    font-weight: 400;
  }
`;

const StepArrow = styled.span`
  width: 120px;
  padding: 0.5rem 0.75rem;
  text-align: center;
`;

const SplitDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 2rem 1rem;
`;

const ContentCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const ParticipantCard = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const ParticipantHeadingLabel = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  background-color: var(--ma-blue-primary-50);
  font-size: 15px;
  font-weight: 600;
`;

const ClubDetailLabel = styled.h6`
  font-size: 12px;
  font-weight: 400;
`;

const ClubDetailValue = styled.p`
  font-weight: 600;
`;

const EventMediaObject = styled.div`
  display: flex;
`;

const TicketCard = styled(ContentCard)`
  box-shadow: 0px 7.84391px 15.6878px rgba(18, 38, 63, 0.0313726);
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

const DetailValue = styled.p`
  font-size: 15px;
  font-weight: 600;
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

const TotalAmount = styled.span`
  color: var(--ma-blue);
  font-size: 18px;
  font-weight: 600;
`;

function EventCategoryPicker() {
  const [isModalOpen, setModalOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>open modal &rarr;</button>
      <Modal
        size="lg"
        isOpen={isModalOpen}
        toggle={() => setModalOpen((open) => !open)}
        onClosed={() => setModalOpen(false)}
      >
        <ModalBody>
          <div>
            <h5>Kategori Lomba</h5>
            <p>Silakan pilih salah satu kategori</p>
          </div>

          <TeamFilterList>
            <li>
              <TeamFilterBadge>Individu Putra</TeamFilterBadge>
            </li>
          </TeamFilterList>

          <CategoryGrid>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((categoryId) => (
              <li key={categoryId}>
                <CategoryItem>
                  <input type="radio" name="categoryId" defaultValue={categoryId} />
                  Umum - Barebow - 50m
                </CategoryItem>
              </li>
            ))}
          </CategoryGrid>

          <div className="float-end">
            <ButtonBlue onClick={() => setModalOpen(false)}>Tutup</ButtonBlue>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

const TeamFilterList = styled.ul`
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
`;

const TeamFilterBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: solid 1px var(--ma-blue);
  color: var(--ma-blue);
`;

const CategoryGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
`;

const CategoryItem = styled.label`
  padding: 1rem;
  border: solid 1px var(--ma-gray-100);
  border-radius: 0.25rem;
`;

function ClubPicker() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setModalOpen(true)}>open modal &rarr;</button>
      <Modal
        size="lg"
        isOpen={isModalOpen}
        toggle={() => setModalOpen((open) => !open)}
        onClosed={() => setModalOpen(false)}
      >
        <ModalBody>Club Picker</ModalBody>
      </Modal>
    </div>
  );
}

export default PageEventRegistration;

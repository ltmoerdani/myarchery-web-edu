import React from "react";
import styled from "styled-components";

import posterLigaJabar from "../../../../assets/images/events/posterLigaJabar.png";

import { ButtonBlue } from "components/ma"
import { useOnClickOutside } from "utils/hooks";

export function TicketViewCard({ totalMembers, eventDetail }) {
  const [openPayment, setOpenPayment] = React.useState(false)
  const paymentRef = React.useRef(null)
  useOnClickOutside(paymentRef, () => setOpenPayment(false))

  return(
    <section>
      <Container>
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <MainCardHeader>
            <h3 className="mt-2">Pendaftaran Liga 1 Jawa Barat 2023</h3>
          </MainCardHeader>
          <ButtonBlue as={Link} to={`/event-registration/regular/${eventDetail?.eventSlug}`}>Daftar Individu di Sini</ButtonBlue>
        </div>


        <div className="mt-3">
          <div className="d-flex justify-content-center bg-white px-4 py-3 mb-5 row rounded">
            <h4>Tiket Lomba</h4>
            <Rule />
            <label className="py-2" style={{ fontWeight: 'bold'}}>Data sudah terkirim dan akan kami proses setelah pembayaran selesai. Informasi lebih lanjut, hubungi CS MyArchery di +62 812 1224 633 pada jam operasional 09.00 - 18.00 WIB.</label>
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
                    src={posterLigaJabar}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </span>
              </div>

              <EventMediaObjectContent>
                <h5>Pendaftaran Liga 1 Jawa Barat 2023</h5>
                <p className="mb-0">
                  Lapangan Mattel Jababeka
                </p>
              </EventMediaObjectContent>
            </EventMediaObject>

            <Rule />

          <TicketSectionDetail>
            <DetailItem
              label="Jenis Regu"
              value='Individu'
            />
            <DetailItem
              label="Jumlah Peserta"
              value={totalMembers}
            />
          </TicketSectionDetail>

            <div className="d-flex justify-content-between my-3">
              <DetailValue>Total Pembayaran</DetailValue>
              <Price>Rp. {totalMembers*350000}</Price>
            </div>

            {openPayment ? (
              <BackgroundPayment>
                <embed ref={paymentRef} src="https://pay.oyindonesia.com/6b80e1b8-c4c5-45c4-a102-31fb7e0d9c6e" height={500} />
              </BackgroundPayment>
            ): null}

            <ButtonBlue onClick={() => setOpenPayment(true)}>Selesaikan Pembayaran</ButtonBlue>
          </div>
        </div>
      </Container>
    </section>
  )
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

const Container = styled.div`
  margin-right: 5rem;
  margin-left: 5rem;
`;

const MainCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Rule = styled.hr`
  margin: 1rem;
`;

const EventMediaObject = styled.div`
  display: flex;
  gap: 1rem;
`;

const EventMediaObjectContent = styled.div`
  flex: 1 1 0%;
  margin: auto;
`;

const TicketSectionDetail = styled.div`
  margin-bottom: 4rem;
`;

const DetailLabel = styled.h6`
  font-weight: 400;
`;

const Price = styled.h3`
  font-weight: 600;
  color: var(--ma-blue);
`;

const isTextMuted = ({ muted }) => (muted ? "color: var(--ma-gray-400);" : "");

const DetailValue = styled.p`
  font-size: 15px;
  font-weight: 600;
  text-transform: capitalize;
  ${isTextMuted}
`;


const BackgroundPayment = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.5);
    z-index: 99999;
    justify-content: center;
    align-items: center;
    display: flex;
`;
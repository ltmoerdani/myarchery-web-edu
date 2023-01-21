import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";

import { ButtonCTABig } from "./button-cta-big";

import Countdown from "react-countdown";
import CurrencyFormat from "react-currency-format";

import classnames from "classnames";
import { isAfter, isBefore } from "date-fns";
import { datetime } from "utils";

function CardEventCTA({ eventDetail, categories = [] }) {
  const { isLoggedIn } = useSelector(getAuthenticationStore);

  const captionCopy = "Segera daftarkan dirimu dan timmu pada kompetisi";
  const registerEventEnd = datetime.parseServerDatetime(eventDetail.registrationEndDatetime);
  const { isBeforeRegistration, isRegistrationOpen } = React.useMemo(
    () => _checkIsRegistrationOpen(eventDetail),
    [eventDetail]
  );

  // Options untuk render harga menurut jenis regu
  const priceOptions = React.useMemo(() => {
    if (!eventDetail?.eventPrice || !categories?.length) {
      return [];
    }

    const teamTypes = {};
    for (const category of categories) {
      const types = {
        "individu male": "individu",
        "individu female": "individu",
        individu_mix: "individu_mix",
        male_team: "team",
        female_team: "team",
        mix_team: "mix",
      };
      const type = types[category.teamCategoryId.id];
      teamTypes[type] = teamTypes[type] ? teamTypes[type] + 1 : 1;
    }

    // Kategori tim yang gak dibuka nilainya akan `null`.
    // Filter dulu yang ada nilainya aja sebelum di-map.
    const teamsIdsFromPrices = Object.keys(eventDetail.eventPrice);
    const visiblePrices = teamsIdsFromPrices.filter((teamCategory) => {
      // Ambil objek hanya yang ada datanya sekaligus yang muncul di list kategori
      return eventDetail.eventPrice[teamCategory] && teamTypes[teamCategory];
    });

    const priceOptions = visiblePrices.map((teamCategory) => {
      const priceByTeam = eventDetail.eventPrice[teamCategory];
      const hasEarlyBirdPrice = Boolean(priceByTeam.isEarlyBird);
      return {
        teamCategoryId: teamCategory,
        teamLabel: _getTeamLabelFromTeamId(teamCategory),
        amount: Number(priceByTeam.price),
        isEarlyBird: hasEarlyBirdPrice,
        amountEarlyBird: Number(priceByTeam.earlyBird),
        endDateEarlyBird: hasEarlyBirdPrice
          ? datetime.parseServerDatetime(priceByTeam.endDateEarlyBird)
          : null,
      };
    });

    return priceOptions;
  }, [eventDetail, categories]);

  const earlyBird = React.useMemo(() => {
    if (!priceOptions?.length) {
      return null;
    }

    const earlyBirdData = priceOptions.reduce((earlyBirdData, option) => {
      if (
        !option.isEarlyBird ||
        earlyBirdData.earlyBirdExpirationDate ||
        earlyBirdData.earlyBirdExpirationDateLabel
      ) {
        return earlyBirdData;
      }
      earlyBirdData.earlyBirdExpirationDate = option.endDateEarlyBird;
      earlyBirdData.earlyBirdExpirationDateLabel = datetime.formatFullDateLabel(
        option.endDateEarlyBird,
        { withDay: true }
      );
      return earlyBirdData;
    }, {});

    if (!earlyBirdData.earlyBirdExpirationDate) {
      return null;
    }

    return earlyBirdData;
  }, [priceOptions]);

  if (!eventDetail) {
    return <ContentSheet>Sedang memuat data event...</ContentSheet>;
  }

  // const registrationRoute = eventDetail.withContingent ? `/event-registration/${eventDetail.eventSlug}` : `/event-registration/regular/${eventDetail.eventSlug}`

  return (
    <ContentSheet>
      <VerticalSpaced>
        <RegistrationHeading>Biaya Pendaftaran</RegistrationHeading>

        <RegistrationPriceGrid>
          {priceOptions.map((option) => (
            <RegistrationPriceItem key={option.teamCategoryId}>
              <PriceTeamCategoryLabel>{option.teamLabel}</PriceTeamCategoryLabel>
              <PriceGroup>
                {option.isEarlyBird ? (
                  <React.Fragment>
                    <EarlyBirdPriceLabel>
                      <AmountWithCurrency amount={option.amount} />
                    </EarlyBirdPriceLabel>

                    <MainPriceLabel>
                      <AmountWithCurrency amount={option.amountEarlyBird} />
                    </MainPriceLabel>
                  </React.Fragment>
                ) : (
                  <MainPriceLabel>
                    <AmountWithCurrency amount={option.amount} />
                  </MainPriceLabel>
                )}
              </PriceGroup>
            </RegistrationPriceItem>
          ))}
        </RegistrationPriceGrid>

        <div>
          {earlyBird?.earlyBirdExpirationDateLabel ? (
            <React.Fragment>
              <strong>Early Bird sampai {earlyBird.earlyBirdExpirationDateLabel}</strong> &#124;{" "}
              <span>
                {captionCopy} {eventDetail.eventName}
              </span>
            </React.Fragment>
          ) : (
            <span>
              {captionCopy} {eventDetail.eventName}
            </span>
          )}
        </div>
      </VerticalSpaced>

      <VerticalSpaced>
        {!isBeforeRegistration && <Countdown date={registerEventEnd} renderer={renderCountDown} />}

        <div>
          {!isRegistrationOpen ? (
            <ButtonCTABig disabled>Pendaftaran Ditutup</ButtonCTABig>
          ) : (
            <ButtonCTABig
              as={Link}
              to={
                !isLoggedIn
                  ? `/archer/login?path=/event-registration/${eventDetail.eventSlug}`
                  : `/event-registration/${eventDetail.eventSlug}`

              }
            >
              Daftar Event
            </ButtonCTABig>
          )}
        </div>
      </VerticalSpaced>
    </ContentSheet>
  );
}

const ContentSheet = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;

  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  color: var(--ma-text-black);
`;

const VerticalSpaced = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const RegistrationHeading = styled.h5`
  font-size: 1.125rem;
  font-weight: 600;
`;

const RegistrationPriceGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.125rem 0.75rem;

  > * {
    flex-grow: 1;
    min-height: 6rem;
  }
`;

const RegistrationPriceItem = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0.5rem;
  border: 1px solid var(--ma-secondary);
  border-radius: 0.25rem;
  text-align: center;
`;

const PriceTeamCategoryLabel = styled.div`
  flex-shrink: 0;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background-color: var(--ma-secondary);

  color: #495057;
  text-align: center;
  text-transform: capitalize;
`;

const PriceGroup = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainPriceLabel = styled.div`
  color: var(--ma-blue);
  font-size: 0.75rem;
  font-weight: 600;

  @media (min-width: 455px) {
    font-size: 1.25rem;
  }

  @media (min-width: 769px) {
    font-size: 1.25rem;
  }
`;

const EarlyBirdPriceLabel = styled.div`
  color: var(--ma-gray-400);
  text-decoration: line-through;
`;

/* ============================================= */

function AmountWithCurrency({ amount }) {
  if (!amount) {
    return <span>Gratis</span>;
  }

  return (
    <CurrencyFormat
      displayType={"text"}
      value={amount}
      prefix="Rp"
      thousandSeparator={"."}
      decimalSeparator={","}
      decimalScale={0}
      fixedDecimalScale
    />
  );
}

/* ============================================= */

function renderCountDown({ days, hours, minutes, seconds, completed }) {
  return (
    <CountdownWrapper className={classnames({ "count-down-completed": completed })}>
      <CounterItem>
        <CounterNumber>{days}</CounterNumber>
        <CounterUnit>Hari</CounterUnit>
      </CounterItem>

      <CounterItem>
        <CounterNumber>{hours}</CounterNumber>
        <CounterUnit>Jam</CounterUnit>
      </CounterItem>

      <CounterItem>
        <CounterNumber>{minutes}</CounterNumber>
        <CounterUnit>Menit</CounterUnit>
      </CounterItem>

      <CounterItem>
        <CounterNumber>{seconds}</CounterNumber>
        <CounterUnit>Detik</CounterUnit>
      </CounterItem>
    </CountdownWrapper>
  );
}

const CountdownWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  text-align: center;
`;

const CounterItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  min-height: 6rem;
  border-radius: 0.25rem;
  border: solid 1px #eff2f7;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    flex-shrink: 0;
  }
`;

const CounterNumber = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--ma-text-black);
  font-size: 1.625rem;
  font-weight: 600;

  .count-down-completed & {
    color: var(--ma-gray-400);
  }
`;

const CounterUnit = styled.span`
  padding: 0.25rem 0.5rem;
  background-color: #eff2f7;
  font-size: 0.75rem;
  font-weight: 400;

  .count-down-completed & {
    background-color: var(--ma-gray-50);
    color: var(--ma-gray-400);
  }
`;

/* =========================================== */
// utils

function _getTeamLabelFromTeamId(teamCategory) {
  const labels = {
    individu: "Individu",
    team: "Beregu",
    mix: "Campuran",
  };
  return labels[teamCategory];
}

function _checkIsRegistrationOpen(eventDetail) {
  const today = new Date();
  const registerEventStart = datetime.parseServerDatetime(eventDetail.registrationStartDatetime);
  const registerEventEnd = datetime.parseServerDatetime(eventDetail.registrationEndDatetime);

  const isRegistrationOpen = Boolean(eventDetail.canRegister);
  // "before" & "after" ini merujuk ke tanggal pendaftaran "default",
  // yang berlaku secara umum untuk semua kategori, bukan tanggal
  // pendaftaran khusus yang diset di pengaturan step 4.
  // Timer countdown dirender berdasarkan tanggal default, sedangkan
  // `isOpen`/`canRegister` dihitung dengan tanggal khusus tersebut
  // juga.
  const isBeforeRegistration = isBefore(today, registerEventStart);
  const isAfterRegistration = isAfter(today, registerEventEnd);

  return {
    isRegistrationOpen,
    isAfterRegistration,
    isBeforeRegistration,
  };
}

export { CardEventCTA };

import * as React from "react";
import styled from "styled-components";
import { useBooking } from "../hooks/booking";
import { useCountDown } from "../hooks/count-down";

import { LoadingScreen } from "components/ma";

function BannerReservation({ category }) {
  const { data: booking, deleteBooking, isLoading } = useBooking(category);
  const { expiredBookingTime: timestamp } = booking || {};

  if (!timestamp) {
    return (
      <React.Fragment>
        <BannerTimerWrapper className="timer-muted">
          Tiket akan tereservasi ketika kategori lomba sudah dipilih. Form dapat diisi selama{" "}
          <TimerTextWrapper>15 menit</TimerTextWrapper>.
        </BannerTimerWrapper>
        <LoadingScreen loading={isLoading} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <BannerTimerWrapper>
        Tiket Anda sudah tereservasi. Selesaikan isi form dalam{" "}
        <TimerText key={timestamp} timestamp={timestamp} onTimeout={deleteBooking} />. Jika melebihi
        batas waktu, reservasi akan dibuka kembali.
      </BannerTimerWrapper>
      <LoadingScreen loading={isLoading} />
    </React.Fragment>
  );
}

function TimerText({ timestamp, onTimeout }) {
  const duration = useCountDown({ endTimestamp: timestamp, onTimeout });
  const formatedTimer = _formatTimer(duration);
  return <TimerTextWrapper>{formatedTimer}</TimerTextWrapper>;
}

/* ==================================== */
// styles

const BannerTimerWrapper = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--ma-yellow-50);
  color: var(--ma-txt-black);

  &.timer-muted {
    background-color: var(--ma-gray-100);
    color: var(--ma-gray-400);
  }
`;

const TimerTextWrapper = styled.span`
  font-weight: 600;
`;

/* ==================================== */
// utils

function _formatTimer(duration) {
  if (!duration) {
    return undefined;
  }
  const minutes = _getDigits(duration.minutes);
  const seconds = _getDigits(duration.seconds);
  return `00:${minutes}:${seconds}`;
}

function _getDigits(number) {
  const numberAsString = number.toString();
  return numberAsString.length > 1 ? numberAsString : "0" + numberAsString;
}

export { BannerReservation };

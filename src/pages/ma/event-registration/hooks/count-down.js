import * as React from "react";
import { intervalToDuration, fromUnixTime, isPast } from "date-fns";

function useCountDown({ endTimestamp, initialDuration = { minutes: 15, seconds: 0 }, onTimeout }) {
  const [duration, setDuration] = React.useState(initialDuration);

  React.useEffect(() => {
    if (!endTimestamp) {
      return;
    }

    const intervalTimer = setInterval(() => {
      const now = Date.now();
      const interval = {
        // date yang di-generate di client side sudah dalam timezone client/user-agent
        start: new Date(now),
        // timestamp dari server/unix timestamp masih dalam UTC,
        // fromUnixTime() perlu untuk handle konversi ke timezone client
        end: fromUnixTime(endTimestamp),
      };
      const duration = intervalToDuration(interval);

      if (isPast(interval.end)) {
        onTimeout?.();
        clearInterval(intervalTimer);
      } else {
        setDuration(duration);
      }
    }, 1000);

    return () => clearInterval(intervalTimer);
  }, [endTimestamp]);

  return duration;
}

export { useCountDown };

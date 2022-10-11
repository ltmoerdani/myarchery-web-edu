import { parseISO, format } from "date-fns";
import id from "date-fns/locale/id";

const locale = id;

function parseServerDatetime(dateString) {
  try {
    return parseISO(dateString);
  } catch {
    return null;
  }
}

function formatServerDatetime(date) {
  try {
    return format(date, "yyyy-MM-dd HH:mm:ss");
  } catch {
    return undefined;
  }
}

function formatServerDate(date) {
  try {
    return format(date, "yyyy-MM-dd");
  } catch {
    return undefined;
  }
}

function formatFullDateLabel(date, { withDay = false, withTime = false } = {}) {
  const dateObject = typeof date === "string" ? parseISO(date) : date;
  try {
    if (withDay) {
      return format(dateObject, "EEEE, d MMMM yyyy", { locale: id });
    }
    if (withTime) {
      return format(dateObject, "d MMMM yyyy, HH:mm:ss", { locale: id });
    }
    return format(dateObject, "d MMMM yyyy", { locale: id });
  } catch {
    return "Tanggal tidak valid";
  }
}

export default {
  parseServerDatetime,
  formatServerDatetime,
  formatServerDate,
  formatFullDateLabel,
  locale,
};

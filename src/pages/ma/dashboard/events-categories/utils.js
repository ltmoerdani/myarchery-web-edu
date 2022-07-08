import { isPast, parseISO, addDays } from "date-fns";

function shouldDisableEditing(eventDateEnd) {
  if (!eventDateEnd) {
    return false;
  }
  const dateEnd = typeof eventDateEnd === "string" ? parseISO(eventDateEnd) : eventDateEnd;
  const fourDaysAfterEnd = addDays(dateEnd, 4);
  return isPast(fourDaysAfterEnd);
}

export { shouldDisableEditing };

import { isPast, parseISO } from "date-fns";

function shouldDisableEditing(eventDateEnd) {
  if (!eventDateEnd) {
    return true;
  }
  const dateEnd = typeof eventDateEnd === "string" ? parseISO(eventDateEnd) : eventDateEnd;
  return isPast(dateEnd);
}

export { shouldDisableEditing };

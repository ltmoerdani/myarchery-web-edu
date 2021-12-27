import React from "react";
import EventItemCard from "./EventItemCard";
import EventEmptyCard from "./EventEmptyCard";

function EventOrderItemCard({ order }) {
  if (!order) {
    return <EventEmptyCard />;
  }
  return <EventItemCard event={order} />;
}
export default EventOrderItemCard;

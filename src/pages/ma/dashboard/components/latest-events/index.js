import React from "react";
import styled from "styled-components";
import { OrderEventService } from "services";

import EventLoading from "./EventLoading";
import EventOrderItemCard from "./EventOrderItemCard";

function makeLatestList(orderData) {
  const listContainer = [null, null, null];
  if (!orderData || !orderData?.length) {
    return listContainer;
  }

  for (let i = 0; i < orderData.length; i++) {
    listContainer[i] = orderData[i];
  }
  return listContainer;
}

const EventListWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;

  @media (min-width: 680px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

function LatestEventsList() {
  const [orders, setOrders] = React.useState(null);

  React.useEffect(() => {
    const getEventOrders = async () => {
      const { data, success } = await OrderEventService.getAll();
      if (success) {
        const latestThreeOrders = data.slice(0, 3);
        setOrders(latestThreeOrders);
      }
    };
    getEventOrders();
  }, []);

  return (
    <EventListWrapper>
      {!orders ? (
        <EventLoading />
      ) : (
        makeLatestList(orders)?.map((order, index) => (
          <EventOrderItemCard key={index} order={order} />
        ))
      )}
    </EventListWrapper>
  );
}

export default LatestEventsList;

import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import CardTransaction from "./components/CardTransaction";
import { OrderEventService } from "services";
import { BreadcrumbDashboard } from "../components/breadcrumb";

function ListTransactionPage() {
  const [dataEvent, setDataEvent] = useState();

  const breadcrumpCurrentPageLabel = "Dashboard";

  const getAllOrderEvent = async () => {
    const { data, message, errors } = await OrderEventService.getAll();
    if (data) {
      setDataEvent(data);
    }
    console.log(message);
    console.log(errors);
  };

  useEffect(() => {
    getAllOrderEvent();
  }, []);

  return (
    <React.Fragment>
      <Container fluid>
      <BreadcrumbDashboard to="/dashboard">
          {breadcrumpCurrentPageLabel}
        </BreadcrumbDashboard>
        <div className="pt-5">
          {dataEvent?.map((event) => {
            return (
              <>
                <CardTransaction
                  eventName={event?.archeryEvent?.eventName}
                  eventType={event?.archeryEvent?.eventType}
                  eventStart={event?.archeryEvent?.eventStartDatetime}
                  eventEnd={event?.archeryEvent?.eventEndDatetime}
                  poster={event?.archeryEvent?.poster}
                  location={event?.archeryEvent?.location}
                  idEvent={event?.participant?.id}
                />
              </>
            );
          })}
        </div>
      </Container>
    </React.Fragment>
  );
}

export default ListTransactionPage;

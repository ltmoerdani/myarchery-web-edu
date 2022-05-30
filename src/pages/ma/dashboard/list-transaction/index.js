import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import CardTransaction from "./components/CardTransaction";
import { OrderEventService } from "services";
import { BreadcrumbDashboard } from "../components/breadcrumb";
import CardTransactionOfficial from "./components/CardTransactionOfficial";

function ListTransactionPage() {
  const [dataEvent, setDataEvent] = useState();
  const [dataOfficial, setDataOfficial] = useState();

  const breadcrumpCurrentPageLabel = "Dashboard";

  const getAllOrderEvent = async () => {
    const { data, message, errors } = await OrderEventService.getAll();
    if (data) {
      setDataEvent(data);
    }
    console.log(message);
    console.log(errors);
  };

  const getAllOfficialEvent = async () => {
    const { data, message, errors } = await OrderEventService.getAllOfficial();
    if (data) {
      setDataOfficial(data);
    }
    console.log(message);
    console.log(errors);
  };


  useEffect(() => {
    getAllOrderEvent();
    getAllOfficialEvent();
  }, []);
  
  return (
    <React.Fragment>
      <Container fluid>
        <BreadcrumbDashboard to="/dashboard">{breadcrumpCurrentPageLabel}</BreadcrumbDashboard>
        <div className="pt-5">
          {dataEvent?.map((event, index) => (
            <CardTransaction
              key={index}
              eventName={event?.archeryEvent?.eventName}
              eventType={event?.archeryEvent?.eventType}
              eventStart={event?.archeryEvent?.eventStartDatetime}
              eventEnd={event?.archeryEvent?.eventEndDatetime}
              poster={event?.archeryEvent?.poster}
              location={event?.archeryEvent?.location}
              idEvent={event?.participant?.id}
            />
          ))}
          
          {dataOfficial && dataOfficial?.map((event, index) => (
            <CardTransactionOfficial
              key={index}
              eventName={event?.archeryEventOfficialDetail?.detailEvent?.publicInformation?.eventName}
              eventType={event?.archeryEventOfficialDetail?.detailEvent?.eventType}
              eventStart={event?.archeryEventOfficialDetail?.detailEvent?.publicInformation?.eventStart}
              eventEnd={event?.archeryEventOfficialDetail?.detailEvent?.publicInformation?.eventEnd}
              poster={event?.archeryEventOfficialDetail?.detailEvent?.publicInformation?.eventBanner}
              location={event?.archeryEventOfficialDetail?.detailEvent?.publicInformation?.eventLocation}
              idEvent={event?.detailArcheryEventOfficial?.eventOfficialId}
            />
          ))}
        </div>
      </Container>
    </React.Fragment>
  );
}

export default ListTransactionPage;

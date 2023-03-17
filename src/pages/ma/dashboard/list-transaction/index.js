import React, { useEffect, useState } from "react";
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import CardTransaction from "./components/CardTransaction";
import { OrderEventService } from "services";
import { BreadcrumbDashboard } from "../components/breadcrumb";
import CardTransactionOfficial from "./components/CardTransactionOfficial";

import classnames from "classnames";

function ListTransactionPage() {
  const [dataEvent, setDataEvent] = useState();
  const [dataOfficial, setDataOfficial] = useState();
  const [activeTab, setActiveTab] = useState("1");

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
        <BreadcrumbDashboard to="/dashboard">
          {breadcrumpCurrentPageLabel}
        </BreadcrumbDashboard>

        <Nav>
          <NavItem>
            <NavLink
              className={classnames({ activate: activeTab === "1" })}
              onClick={() => setActiveTab("1")}
            >
              Event
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={classnames({ activate: activeTab === "2" })}
              onClick={() => setActiveTab("2")}
            >
              Official
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <div className="pt-4">
              {dataEvent?.length ? (
                dataEvent?.map((event, index) => {
                  if (event.archeryEvent) {
                    return (
                      <CardTransaction
                        key={index}
                        orderId={event?.orderId}
                        eventName={event?.archeryEvent?.eventName}
                        eventType={event?.archeryEvent?.eventType}
                        eventStart={event?.archeryEvent?.eventStartDatetime}
                        eventEnd={event?.archeryEvent?.eventEndDatetime}
                        poster={event?.archeryEvent?.poster}
                        location={event?.archeryEvent?.location}
                      />
                    );
                  }
                })
              ) : (
                <h4 className="text-muted">Tidak ada event terdaftar</h4>
              )}
            </div>
          </TabPane>

          <TabPane tabId="2">
            <div className="pt-4">
              {dataOfficial &&
                dataOfficial?.map((event, index) => (
                  <CardTransactionOfficial
                    key={index}
                    eventName={
                      event?.archeryEventOfficialDetail?.detailEvent
                        ?.publicInformation?.eventName
                    }
                    eventType={
                      event?.archeryEventOfficialDetail?.detailEvent?.eventType
                    }
                    eventStart={
                      event?.archeryEventOfficialDetail?.detailEvent
                        ?.publicInformation?.eventStart
                    }
                    eventEnd={
                      event?.archeryEventOfficialDetail?.detailEvent
                        ?.publicInformation?.eventEnd
                    }
                    poster={
                      event?.archeryEventOfficialDetail?.detailEvent
                        ?.publicInformation?.eventBanner
                    }
                    location={
                      event?.archeryEventOfficialDetail?.detailEvent
                        ?.publicInformation?.eventLocation
                    }
                    idEvent={event?.detailArcheryEventOfficial?.eventOfficialId}
                  />
                ))}
            </div>
          </TabPane>
        </TabContent>
      </Container>
    </React.Fragment>
  );
}

export default ListTransactionPage;

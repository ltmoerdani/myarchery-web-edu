import * as React from "react";
import styled from "styled-components";

import { parseISO, format } from "date-fns";
import { id } from "date-fns/locale";

function TabbedContents({ eventDetail, dataFAQ }) {
  const [selectedTab, setSelectedTab] = React.useState("desc");

  const dateEventStart = eventDetail?.eventStartDatetime
    ? parseISO(eventDetail.eventStartDatetime)
    : "";

  const dateEventEnd = eventDetail?.eventEndDatetime ? parseISO(eventDetail.eventEndDatetime) : "";

  return (
    <div className="mt-4">
      <div className="d-flex">
        <div
          onClick={() => setSelectedTab("desc")}
          className="py-2 pe-4 ps-3"
          style={{
            width: "204px",
            backgroundColor: `${selectedTab === "desc" ? "#0D47A1" : "#FFF"}`,
            borderRadius: "5px 5px 0 0",
            color: `${selectedTab === "desc" ? "#FFF" : "#000"}`,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: `${selectedTab === "desc" ? "none" : "0 0.1rem 0.5rem rgb(18 38 63 / 10%)"}`,
          }}
        >
          Deskripsi
        </div>

        <div
          onClick={() => setSelectedTab("faq")}
          className="ms-2 py-2 pe-4 ps-3"
          style={{
            width: "204px",
            backgroundColor: `${selectedTab === "faq" ? "#0D47A1" : "#FFF"}`,
            borderRadius: "5px 5px 0 0",
            color: `${selectedTab === "faq" ? "#FFF" : "#000"}`,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: `${selectedTab === "faq" ? "none" : "0 0.1rem 0.5rem rgb(18 38 63 / 10%)"}`,
          }}
        >
          FAQ
        </div>
      </div>

      <div className="event-box">
        {selectedTab === "desc" && (
          <div>
            <div>
              <h3>Deskripsi</h3>

              <DescriptionContent>{eventDetail?.description}</DescriptionContent>
            </div>

            <h3>Waktu &amp; Tempat</h3>

            <table className="mb-3 content-info-time-place">
              <tbody>
                <tr>
                  <td style={{ minWidth: 120 }}>Tanggal Event</td>
                  <td style={{ minWidth: "0.5rem" }}>:</td>
                  <td>
                    {eventDetail
                      ? `${formatEventDate(dateEventStart)} - ${formatEventDate(dateEventEnd)}`
                      : "tanggal tidak tersedia"}
                  </td>
                </tr>

                <tr>
                  <td>Lokasi</td>
                  <td>:</td>
                  <td>{eventDetail?.location}</td>
                </tr>

                <tr>
                  <td>Kota</td>
                  <td>:</td>
                  <td>{eventDetail?.detailCity?.name}</td>
                </tr>

                <tr>
                  <td>Lapangan</td>
                  <td>:</td>
                  <td>{eventDetail?.locationType}</td>
                </tr>
              </tbody>
            </table>

            {eventDetail?.moreInformation?.map((information) => {
              return (
                <div key={information.id}>
                  <h5 className="content-info-heading">{information?.title}</h5>

                  <div>
                    <DescriptionContent>{information?.description}</DescriptionContent>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedTab === "faq" && (
          <div>
            <h3>FAQ</h3>

            {dataFAQ.map((data) => {
              if (!data?.isHide) {
                return (
                  <div className="mb-2" key={data.id}>
                    <span style={{ fontSize: "16px", fontWeight: "600", color: "#1C1C1C" }}>
                      {data?.question}
                    </span>

                    <br />

                    <span>{data?.answer}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const DescriptionContent = styled.p`
  white-space: pre-wrap;
`;

// util
function formatEventDate(date) {
  try {
    let dateObject = typeof date === "string" ? parseISO(date) : date;
    return format(dateObject, "d MMMM yyyy", { locale: id });
  } catch {
    return "Tanggal Invalid";
  }
}

export { TabbedContents };

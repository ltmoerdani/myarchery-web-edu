import React from "react";
import styled from "styled-components";

import { Table } from "reactstrap";

import { id } from "date-fns/locale";
import { parseISO, format } from "date-fns";

function TabEvent({ eventState }) {
  const { data: event } = eventState;
  const isLoadingEvent = eventState.status === "loading";

  return (
    <PanelContainer>
      {!event && isLoadingEvent ? (
        <div>Sedang memuat data lomba...</div>
      ) : (
        event && (
          <EventMediaObject>
            <MediaImage>
              <PosterContainer>
                {event.publicInformation.eventBanner ? (
                  <img src={event.publicInformation.eventBanner} />
                ) : (
                  <React.Fragment>gambar banner</React.Fragment>
                )}
              </PosterContainer>
            </MediaImage>

            <MediaContent>
              <Table responsive>
                <tbody>
                  <tr>
                    <td width="200">Nama Event</td>
                    <td width="16">:</td>
                    <td>
                      <div>{event.publicInformation.eventName}</div>
                    </td>
                  </tr>

                  <tr>
                    <td>Jenis Event</td>
                    <td width="16">:</td>
                    <td>
                      <div>{event.eventCompetition}</div>
                    </td>
                  </tr>

                  <tr>
                    <td>Lokasi</td>
                    <td width="16">:</td>
                    <td>{event.publicInformation.eventCity.nameCity}</td>
                  </tr>

                  <tr>
                    <td>Tanggal</td>
                    <td width="16">:</td>
                    <td>
                      {format(parseISO(event.publicInformation.eventStart), "dd MMMM yyyy", {
                        locale: id,
                      })}{" "}
                      &ndash;{" "}
                      {format(parseISO(event.publicInformation.eventEnd), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </MediaContent>
          </EventMediaObject>
        )
      )}
    </PanelContainer>
  );
}

const PanelContainer = styled.div`
  padding: 1.5rem;
  padding-top: 2.5rem;
`;

const EventMediaObject = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
`;

const MediaImage = styled.div`
  flex: 0 1 0%;
`;

const MediaContent = styled.div`
  flex: 1 1 26.25rem;
`;

const PosterContainer = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 0.75rem;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export { TabEvent };

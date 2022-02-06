import React from "react";
import styled from "styled-components";

import { Table } from "reactstrap";

function TabPeserta({ participantMembersState }) {
  const { data: participantMembers } = participantMembersState;
  const isLoadingOrder = participantMembersState.status === "loading";

  return (
    <PanelContainer>
      {!participantMembers && isLoadingOrder ? (
        <div>Sedang memuat data lomba...</div>
      ) : (
        participantMembers && (
          <Table responsive>
            <tbody>
              <tr>
                <td width="200">Nama Pendaftar</td>
                <td width="16">:</td>
                <td>
                  <div>{participantMembers.participant.name}</div>
                </td>
              </tr>

              <tr>
                <td>Email</td>
                <td width="16">:</td>
                <td>
                  <div>{participantMembers.participant.email}</div>
                </td>
              </tr>

              <tr>
                <td>No. Telepon</td>
                <td width="16">:</td>
                <td>{participantMembers.participant.phoneNumber || <span>&ndash;</span>}</td>
              </tr>
            </tbody>
          </Table>
        )
      )}
    </PanelContainer>
  );
}

const PanelContainer = styled.div`
  padding: 1.5rem;
`;

export { TabPeserta };

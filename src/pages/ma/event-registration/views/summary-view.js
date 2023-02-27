import * as React from "react";
import styled from "styled-components";

import { Table } from "reactstrap";
import { Show } from "../components/show-when";

import IconAddress from "components/ma/icons/mono/address";
import { TableCellText } from "./list-participant/single-list-participant";
import { stringUtil } from "utils";

const SummaryMultipleParticipant = ({ formOrder }) => {
  const headTable = ["No", "Email", "Nama", "Usia"];
  const { dataParticipant } = formOrder.data;
  return (
    <TableListParticipant className="list-table-participant">
      <thead>
        <tr>
          {headTable.map((e) => (
            <th key={stringUtil.createRandom()}>{e}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {dataParticipant &&
          dataParticipant.map((e, i) => (
            <tr key={e.email}>
              <td className="number-text" style={{ width: "10px" }}>
                {i + 1}
              </td>
              <td>
                <TableCellText>{e.email}</TableCellText>
              </td>
              <td>
                <TableCellText>{e.name}</TableCellText>
              </td>
              <td>
                <div
                  style={{
                    width: "60px",
                    paddingLeft: 2,
                    textTransform: "capitalize",
                  }}
                >
                  {Math.floor(
                    (new Date() - new Date(e.date_of_birth).getTime()) /
                      3.15576e10
                  )}{" "}
                  Tahun
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </TableListParticipant>
  );
};

const TableListParticipant = styled.table`
  width: 100%;
  min-height: 50vh;
  border-collapse: separate;
  border-spacing: 0 0.25rem;
  display: block;
  overflow: auto;
  &.list-table-participant {
    &::-webkit-scrollbar {
      height: 5px;
      background: #eff2f7;
    }
    &::-webkit-scrollbar-track {
      border-radius: 20px;
    }
    ::-webkit-scrollbar-thumb {
      background: #c0c0c0;
      border-radius: 20px;
    }
  }

  th,
  td {
    cursor: auto;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  thead > tr > th {
    padding: 0.75rem;
    background-color: var(--ma-primary-blue-50);
  }

  tbody > tr > td {
    padding: 0.8125rem 0.625rem;
    background-color: #ffffff;
    font-size: 0.875em;
    border-bottom: 2px solid #eff2f7;

    .css-1okebmr-indicatorSeparator {
      background-color: white;
    }

    .number-text {
      width: 10px;
    }
  }
  @media (max-width: 780px) {
    th,
    td {
      width: 40%;
      cursor: auto;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    th,
    td.number-text {
      width: 10%;
    }
  }
`;

function SummaryView({ userProfile, formOrder }) {
  const { data: formData } = formOrder;
  const { club, isCollective } = formData;
  return (
    <React.Fragment>
      <ContentCard>
        <MainCardHeader>
          <WrappedIcon>
            <IconAddress />
          </WrappedIcon>
          <MainCardHeaderText>
            {isCollective ? "DETAIL PESERTA" : "Detail Pendaftar"}
          </MainCardHeaderText>
        </MainCardHeader>

        <div style={{ width: "100%", marginTop: "20px" }}>
          {!isCollective ? (
            <>
              {userProfile ? (
                <Table responsive className="mt-3">
                  <tbody>
                    <tr>
                      <td>Nama Pendaftar</td>
                      <td width="16">:</td>
                      <td>
                        <div>{userProfile?.name}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td width="16">:</td>
                      <td>
                        <div>{userProfile?.email}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>No. Telepon</td>
                      <td width="16">:</td>
                      <td>
                        {userProfile?.phoneNumber ?? <span>&ndash;</span>}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              ) : null}
            </>
          ) : (
            <SummaryMultipleParticipant formOrder={formOrder} />
          )}
        </div>
      </ContentCard>

      <Show when={club}>
        <ContentCard>
          <SplitFields>
            <SplitFieldItem>
              <ClubDetailLabel>Nama Klub</ClubDetailLabel>
              <ClubDetailValue>{club?.detail.name}</ClubDetailValue>
            </SplitFieldItem>
          </SplitFields>
        </ContentCard>
      </Show>
    </React.Fragment>
  );
}

/* =================================== */
// styles

const ContentCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  padding-bottom: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const MainCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const MainCardHeaderText = styled.h4`
  margin: 0;
`;

const WrappedIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: solid 1px #c4c4c4;
`;

const SplitFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.375rem;
`;

const SplitFieldItem = styled.div`
  flex: 1 1 13.75rem;
`;

const ClubDetailLabel = styled.h6`
  font-size: 12px;
  font-weight: 400;
`;

const ClubDetailValue = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
`;

export { SummaryView };

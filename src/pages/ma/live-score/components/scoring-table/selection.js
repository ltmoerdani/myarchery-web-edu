import * as React from "react";
import styled from "styled-components";
// import { useParticipantScorings } from "../../hooks/participant-scorings";
import { useSelectionScorings } from "../../hooks/selection-scorings";

import { SessionCellsDataHeading, SessionCellsData, FullPageLoadingIndicator } from "../index";

function ScoringTableSelection({ categoryDetail, isEventEnded, scoreType }) {
  const teamType = categoryDetail?.categoryTeam?.toLowerCase?.();
  const { data: scorings, isLoading } = useSelectionScorings(
    categoryDetail?.id,
    teamType,
    scoreType,
    isEventEnded
  );

  if (!categoryDetail || !scorings) {
    return (
      <SectionTableContainer>
        <FullPageLoadingIndicator isLoading={isLoading} />
        <ScoringEmpty>Memproses data scoring...</ScoringEmpty>
      </SectionTableContainer>
    );
  }

  if (teamType === "individual") {
    return (
      <SectionTableContainer>
        <FullPageLoadingIndicator isLoading={isLoading} />

        {!scorings?.length ? (
          <ScoringEmpty>Belum ada data skor di kategori ini</ScoringEmpty>
        ) : (
          <TableScores>
            <thead>
              <tr>
                <th>Rank</th>
                <th className="text-uppercase">Nama</th>
                <th className="text-uppercase">Klub</th>
                <SessionCellsDataHeading sessions={scorings?.[0]?.sessions} />
                <th className="text-uppercase">Total</th>
                <th className="text-uppercase">Jumlah Arrow</th>
                <th className="text-uppercase">Irat</th>
              </tr>
            </thead>

            <tbody>
              {scorings.map((scoring, index) => (
                <tr key={scoring.member.id}>
                  <td>
                    <DisplayRank>
                      <span>{index + 1}</span>
                    </DisplayRank>
                  </td>
                  <td>{scoring.member.name}</td>
                  <td>{scoring.member.clubName || <React.Fragment>&ndash;</React.Fragment>}</td>

                  <SessionCellsData sessions={scoring.sessions} />

                  <td>{scoring.total}</td>
                  <td>{scoring.totalArrow}</td>
                  <td>{scoring.totalIrat}</td>
                </tr>
              ))}
            </tbody>
          </TableScores>
        )}
      </SectionTableContainer>
    );
  }

  if (teamType === "team") {
    return (
      <SectionTableContainer>
        <FullPageLoadingIndicator isLoading={isLoading} />

        {!scorings?.length ? (
          <ScoringEmpty>Belum ada data skor di kategori ini</ScoringEmpty>
        ) : (
          <TableScores>
            <thead>
              <tr>
                <th>Peringkat</th>
                <th className="text-uppercase">Nama Tim</th>
                <th className="text-uppercase">Klub</th>
                <SessionCellsDataHeading sessions={scorings?.[0]?.sessions} />
                <th className="text-uppercase">Total</th>
                <th className="text-uppercase">X+10</th>
                <th className="text-uppercase">X</th>
              </tr>
            </thead>

            <tbody>
              {scorings.map((scoring, index) => (
                <tr key={scoring.participantId}>
                  <td>
                    <DisplayRank>
                      <span>{index + 1}</span>
                    </DisplayRank>
                  </td>

                  <td>
                    <div>
                      <h6>{scoring.team}</h6>
                      {Boolean(scoring.teams?.length) && (
                        <ol>
                          {scoring.teams.map((member) => (
                            <li key={member.id}>{member.name}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </td>

                  <td>{scoring.clubName || <React.Fragment>&ndash;</React.Fragment>}</td>
                  <td>{scoring.total}</td>
                  <td>{scoring.totalXPlusTen}</td>
                  <td>{scoring.totalX}</td>
                </tr>
              ))}
            </tbody>
          </TableScores>
        )}
      </SectionTableContainer>
    );
  }

  return (
    <SectionTableContainer>
      <ScoringEmpty>Error tidak diketahui</ScoringEmpty>
    </SectionTableContainer>
  );
}

const SectionTableContainer = styled.div`
  position: relative;
`;

const TableScores = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.25rem;

  th,
  td {
    cursor: auto;
    white-space: nowrap;
    overflow: hidden;
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
  }
`;

const DisplayRank = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ScoringEmpty = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

// function _getBudrestNumber(member) {
//   if (!member.budRestNumber || !member.targetFace) {
//     return "-";
//   }
//   return member.budRestNumber + member.targetFace;
// }

export { ScoringTableSelection };

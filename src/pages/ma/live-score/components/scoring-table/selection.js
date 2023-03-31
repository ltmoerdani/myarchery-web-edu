import * as React from "react";
import styled from "styled-components";
// import { useParticipantScorings } from "../../hooks/participant-scorings";
import { useSelectionScorings } from "../../hooks/selection-scorings";

import { FullPageLoadingIndicator } from "../index";

function ScoringTableSelection({
  categoryDetail,
  isEventEnded,
  scoreType,
  eventDetail,
}) {
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
                <th className="text-uppercase">
                  {/* Klub */}
                  {eventDetail.parentClassificationTitle}
                </th>
                <SessionCellsDataHeading
                  sessions={scorings?.[0]}
                  scoreType={scoreType}
                />
                <th className="text-uppercase">Total</th>
                <th className="text-uppercase">Total Irat</th>
              </tr>
            </thead>

            <tbody>
              {scorings.map((scoring, index) => {
                return (
                  <tr key={scoring.member.id}>
                    <td>
                      <DisplayRank>
                        <span>{index + 1}</span>
                      </DisplayRank>
                    </td>
                    <td>{scoring.member.name}</td>
                    <td>
                      {/* {scoring.member.clubName || (
                        <React.Fragment>&ndash;</React.Fragment>
                      )} */}
                      {scoring.parentClassificationType === 1
                        ? scoring.clubName
                        : scoring.parentClassificationType === 2
                        ? scoring.countryName
                        : scoring.parentClassificationType === 3
                        ? scoring.provinceName
                        : scoring.parentClassificationType === 4
                        ? scoring.cityName
                        : scoring.childrenClassificationMembersName}
                    </td>

                    <SessionCellsData
                      sessions={scoring}
                      scoreType={scoreType}
                    />
                    {scoreType != 5 ? (
                      <td className="total">{scoring.total}</td>
                    ) : (
                      <td>
                        {scoring?.elimination?.total +
                          scoring?.qualification?.total}
                      </td>
                    )}
                    <td>{scoring.allTotalIrat || scoring.totalIrat}</td>
                  </tr>
                );
              })}
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
                <th className="text-uppercase">
                  {/* Klub */}
                  {eventDetail.parentClassificationTitle}
                </th>
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

                  <td>
                    {/* {scoring.clubName || (
                      <React.Fragment>&ndash;</React.Fragment>
                    )} */}
                    {scoring.parentClassificationType === 1
                      ? scoring.clubName
                      : scoring.parentClassificationType === 2
                      ? scoring.countryName
                      : scoring.parentClassificationType === 3
                      ? scoring.provinceName
                      : scoring.parentClassificationType === 4
                      ? scoring.cityName
                      : scoring.childrenClassificationMembersName}
                  </td>
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

function SessionCellsDataHeading({ sessions, scoreType }) {
  if (
    !sessions ||
    scoreType == null ||
    sessions == null ||
    sessions == undefined
  ) {
    return [];
  }

  return (
    <React.Fragment>
      {(scoreType == 3 || scoreType == 4) && sessions.sessions
        ? Object.keys(sessions?.sessions).map((currentSession) => (
            <th key={currentSession}>
              {scoreType == 3 ? "Sesi " : "Eli-"}
              {currentSession}
            </th>
          ))
        : ""}
      {scoreType == 5 && sessions.qualification
        ? Object.keys(sessions?.qualification?.sessions).map(
            (qualificatiSession) => (
              <th key={qualificatiSession}>Sesi {qualificatiSession}</th>
            )
          )
        : ""}
      {scoreType == 5 ? <th className="total">Total Kual</th> : ""}
      {scoreType == 5 && sessions.qualification
        ? Object.keys(sessions?.elimination?.sessions).map(
            (eliminatiSession) => (
              <th key={eliminatiSession}>Eli-{eliminatiSession}</th>
            )
          )
        : ""}
      {scoreType == 5 ? <th className="total">Total Eli</th> : ""}
    </React.Fragment>
  );
}

function SessionCellsData({ sessions, scoreType }) {
  if (!sessions) {
    return [];
  }

  return (
    <React.Fragment>
      {(scoreType == 3 || scoreType == 4) && sessions.sessions
        ? Object.keys(sessions?.sessions).map((currentSession) => (
            <td key={currentSession}>
              {sessions?.sessions[currentSession]?.total}
            </td>
          ))
        : ""}
      {scoreType == 5 && sessions.qualification
        ? Object.keys(sessions?.qualification?.sessions).map(
            (qualificatiSession) => (
              <td key={qualificatiSession}>
                {sessions.qualification.sessions[qualificatiSession].total}
              </td>
            )
          )
        : ""}
      {scoreType == 5 && sessions.qualification ? (
        <td className="total">{sessions.qualification.total}</td>
      ) : (
        ""
      )}
      {scoreType == 5 && sessions.elimination
        ? Object.keys(sessions?.elimination?.sessions).map(
            (eliminatiSession) => (
              <td key={eliminatiSession}>
                {sessions.elimination.sessions[eliminatiSession].total}
              </td>
            )
          )
        : ""}
      {scoreType == 5 && sessions.elimination ? (
        <td className="total">{sessions.elimination.total}</td>
      ) : (
        ""
      )}
    </React.Fragment>
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

    &.total {
      background-color: var(--ma-gray-50);
    }
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

export { ScoringTableSelection };

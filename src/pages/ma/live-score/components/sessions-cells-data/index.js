import * as React from "react";

const sessionIsNotShootOff = (sessionNumber) => parseInt(sessionNumber) !== 11;

function SessionCellsDataHeading({ sessions }) {
  if (!sessions) {
    return [];
  }
  return Object.keys(sessions)
    .filter(sessionIsNotShootOff)
    .map((currentSession) => <th key={currentSession}>Sesi {currentSession}</th>);
}

function SessionCellsData({ sessions }) {
  if (!sessions) {
    return [];
  }
  return Object.keys(sessions)
    .filter(sessionIsNotShootOff)
    .map((currentSession) => <td key={currentSession}>{sessions[currentSession].total}</td>);
}

export { SessionCellsDataHeading, SessionCellsData };

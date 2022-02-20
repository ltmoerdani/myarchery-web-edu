import * as React from "react";

function SessionCellsDataHeading({ sessions }) {
  if (!sessions) {
    return [];
  }
  return Object.keys(sessions).map((currentSession) => (
    <th key={currentSession}>Sesi {currentSession}</th>
  ));
}

function SessionCellsData({ sessions }) {
  if (!sessions) {
    return [];
  }
  return Object.keys(sessions).map((currentSession) => (
    <td key={currentSession}>{sessions[currentSession].total}</td>
  ));
}

export { SessionCellsDataHeading, SessionCellsData };

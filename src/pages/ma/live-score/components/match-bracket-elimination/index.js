import * as React from "react";
import styled from "styled-components";

import {
  Bracket,
  Seed as RBSeed,
  SeedItem as RBSeedItem,
  SeedTeam as RBSeedTeam,
} from "react-brackets";

import classnames from "classnames";

function MatchBracket({ matchTemplate }) {
  return (
    <Bracket
      rounds={matchTemplate.rounds || []}
      renderSeedComponent={(bracketProps) => (
        <SeedBagan
          bracketProps={bracketProps}
          configs={{
            isSettingApplied: !matchTemplate.updated,
            totalRounds: matchTemplate.rounds.length - 1,
            eliminationId: matchTemplate.eliminationId,
          }}
        />
      )}
    />
  );
}

function SeedBagan({ bracketProps }) {
  const { seed, breakpoint } = bracketProps;

  return (
    <Seed mobileBreakpoint={breakpoint}>
      <SeedItem>
        <ItemContainer>
          {seed.teams.map((team, index) => (
            <SeedTeam key={index} className={classnames({ "item-past": false })}>
              <BoxName>{team.name || "-"}</BoxName>
              {typeof team.result === "number" && <BoxScore>{team.result}</BoxScore>}
            </SeedTeam>
          ))}
        </ItemContainer>
      </SeedItem>
    </Seed>
  );
}

const Seed = styled(RBSeed)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const SeedItem = styled(RBSeedItem)`
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.05);
  background-color: var(--ma-primary-blue-50);
`;

const SeedTeam = styled(RBSeedTeam)`
  gap: 0.25rem;
  padding: 0.5rem;
  border: solid 1px #0d47a1;
  border-radius: 0.25rem;
  background-color: #ffffff;
  color: var(--bs-body-color);
  font-size: var(--bs-body-font-size);

  &.item-past {
    border-color: #757575;
  }
`;

const ItemContainer = styled.div`
  position: relative;

  > ${SeedTeam} + ${SeedTeam} {
    border-top: none;
  }
`;

const BoxName = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const BoxScore = styled.span`
  display: inline-block;
  padding: 2px 0.375rem;
  border-radius: 0.25rem;
  background-color: var(--ma-gray-400);
  color: #ffffff;
  font-weight: 600;
`;

export { MatchBracket };

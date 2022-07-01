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

function SeedBagan({ bracketProps, configs }) {
  const { roundIndex, seed, breakpoint } = bracketProps;

  const isFinalRound =
    (configs.totalRounds === 4 && roundIndex === 3) ||
    (configs.totalRounds === 3 && roundIndex === 2);
  const isThirdPlaceRound =
    (configs.totalRounds === 4 && roundIndex === 4) ||
    (configs.totalRounds === 3 && roundIndex === 3);

  const shouldEnableScoring = () => {
    const noWinnersYet = seed.teams.every((team) => team.win === 0);
    return configs.isSettingApplied && noWinnersYet;
  };

  const isBye = seed.teams.some((team) => team.status === "bye");

  return (
    <Seed
      mobileBreakpoint={breakpoint}
      className={classnames({
        "round-final": isFinalRound,
        "round-third-place": isThirdPlaceRound,
      })}
    >
      <SeedItem>
        <ItemContainer>
          {isFinalRound && <FinalHeading>Medali Emas</FinalHeading>}
          {isThirdPlaceRound && <FinalHeading>Medali Perunggu</FinalHeading>}
          {seed.teams.map((team, index) => (
            <SeedTeam
              key={index}
              className={classnames({
                "item-active": shouldEnableScoring(),
                "item-winner": configs.isSettingApplied && parseInt(team.win) === 1 && !isBye,
              })}
            >
              <BoxName>{team.name || team.team || team.teamName || "-"}</BoxName>
              {typeof team.result === "number" && <BoxScore>{team.result}</BoxScore>}
            </SeedTeam>
          ))}
        </ItemContainer>
      </SeedItem>
    </Seed>
  );
}

const FinalHeading = styled.h6`
  position: absolute;
  top: -2em;
  left: 0;
  right: 0;
  font-weight: 600;
  text-align: center;
`;

const Seed = styled(RBSeed)`
  padding-top: 2rem;
  padding-bottom: 2rem;

  &.round-third-place {
    margin-left: 3.75rem;
  }
`;

const SeedItem = styled(RBSeedItem)`
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.05);
  background-color: var(--ma-primary-blue-50);
`;

const SeedTeam = styled(RBSeedTeam)`
  gap: 0.25rem;
  padding: 0.5rem;
  border: solid 2px #757575;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: var(--bs-body-color);
  font-size: var(--bs-body-font-size);

  &.item-active {
    border-color: #0d47a1;
  }

  &.item-winner {
    border-color: var(--ma-blue);
    background-color: #bc8b2c;
    color: #000000;
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

  .item-winner & {
    background-color: #000000;
  }
`;

export { MatchBracket };

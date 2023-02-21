import * as React from "react";
import styled from "styled-components";

import {
  Bracket,
  Seed as RBSeed,
  SeedItem as RBSeedItem,
  SeedTeam as RBSeedTeam,
} from "react-brackets";

import IconMedalGold from "components/ma/icons/color/medal-gold";
import IconMedalSilver from "components/ma/icons/color/medal-silver";
import IconMedalBronze from "components/ma/icons/color/medal-bronze";

import classnames from "classnames";

function MatchBracket({ matchTemplate, eventDetail }) {
  const { hasWinner, winnerIndex } = _checkThirdPlaceHasWinner(matchTemplate);
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
            thirdPlaceHasWinner: hasWinner,
            thirdPlaceWinnerIndex: winnerIndex,
          }}
          eventDetail={eventDetail}
        />
      )}
    />
  );
}

function SeedBagan({ bracketProps, configs, eventDetail }) {
  const { roundIndex, seed, breakpoint } = bracketProps;
  const { totalRounds, isSettingApplied, thirdPlaceHasWinner, thirdPlaceWinnerIndex } = configs;

  const { isFinalRound, isThirdPlaceRound } = _getRoundPositions({ totalRounds, roundIndex });

  const shouldEnableScoring = () => {
    const noWinnersYet = seed.teams.every((team) => team.win === 0);
    return isSettingApplied && noWinnersYet;
  };

  const hasWinner = seed.teams.some((team) => team.win === 1);
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
          {seed.teams.map((team, teamIndex) => {
            const playerName = team.name || team.team || team.teamName || "-";
            const isWinner = isSettingApplied && Boolean(team.win) && !isBye;
            const isThirdPlaceWinner = isThirdPlaceRound && teamIndex === thirdPlaceWinnerIndex;
            return (
              <SeedTeam
                key={teamIndex}
                className={classnames({
                  "item-active": shouldEnableScoring(),
                  "item-winner": isWinner || isThirdPlaceWinner,
                })}
              >
                <BoxNameGroup>
                  <BoxName title={playerName}>{playerName}</BoxName>
                  {!eventDetail.withContingent ? (
                    <>
                      {team.club && (
                        <BoxName title={team.club} className="name-club">
                          {team.club}
                        </BoxName>
                      )}
                    </>
                  ) : (
                    <>
                      {team.club && (
                        <BoxName title={team.city} className="name-club">
                          {team.city}
                        </BoxName>
                      )}
                    </>
                  )}
                </BoxNameGroup>
                <Score team={team} />

                {/* ! Hati-hati, logika kondisionalnya ruwet pakai ternary wkwk */}
                {/* TODO: refaktor jadi komponen (?) */}
                {isFinalRound && hasWinner ? (
                  isWinner ? (
                    <FinalHeading className={classnames({ "final-bottom": teamIndex > 0 })}>
                      Medali Emas <IconMedalGold size="20" />
                    </FinalHeading>
                  ) : (
                    <FinalHeading className={classnames({ "final-bottom": teamIndex > 0 })}>
                      Medali Perak <IconMedalSilver size="20" />
                    </FinalHeading>
                  )
                ) : isFinalRound && !hasWinner ? (
                  <FinalHeading>Babak Final</FinalHeading>
                ) : isThirdPlaceRound && thirdPlaceHasWinner ? (
                  isThirdPlaceWinner ? (
                    <FinalHeading className={classnames({ "final-bottom": teamIndex > 0 })}>
                      <IconMedalBronze size="20" /> Medali Perunggu
                    </FinalHeading>
                  ) : null
                ) : isThirdPlaceRound && !thirdPlaceHasWinner ? (
                  <FinalHeading>Perebutan Juara 3</FinalHeading>
                ) : null}
              </SeedTeam>
            );
          })}
        </ItemContainer>
      </SeedItem>
    </Seed>
  );
}

function Score({ team }) {
  if (typeof team.result === "number") {
    return <BoxScore>{team.result}</BoxScore>;
  }
  if (typeof team.totalScoring === "number") {
    return <BoxScore>{team.totalScoring}</BoxScore>;
  }
  return null;
}

/* ========================= */
// styles

const FinalHeading = styled.h6`
  position: absolute;
  top: -2.5em;
  left: 0;
  right: 0;
  font-weight: 600;
  text-align: center;

  &.final-bottom {
    top: unset;
    bottom: -3em;
  }
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

    .name-club {
      color: var(--ma-text-black);
    }
  }
`;

const ItemContainer = styled.div`
  position: relative;

  > ${SeedTeam} + ${SeedTeam} {
    border-top: none;
  }
`;

const BoxNameGroup = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const BoxName = styled.span`
  max-width: 10rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;

  &.name-club {
    color: var(--ma-gray-500);
    font-size: 0.7em;
  }
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

/* ========================= */
// utils

function _getRoundPositions({ totalRounds, roundIndex }) {
  const positionByRounds = {
    5: { finalIndex: 4, thirdPlaceIndex: 5 }, // 32 besar
    4: { finalIndex: 3, thirdPlaceIndex: 4 }, // 16 besar
    3: { finalIndex: 2, thirdPlaceIndex: 3 }, // 8 besar
    2: { finalIndex: 1, thirdPlaceIndex: 2 }, // 4 besar
  };

  const { finalIndex, thirdPlaceIndex } = positionByRounds[totalRounds] || {};
  const isFinalRound = roundIndex === finalIndex;
  const isThirdPlaceRound = roundIndex === thirdPlaceIndex;

  return { isFinalRound, isThirdPlaceRound };
}

function _checkThirdPlaceHasWinner(data) {
  const defaultValue = { hasWinner: false, winnerIndex: -1 };

  if (!data) {
    return defaultValue;
  }

  const winningStatusByRound = [];
  for (const index in data.rounds) {
    const round = data.rounds[index];
    const previousIndex = parseInt(index) - 1;
    const previousStatus = previousIndex > -1 ? winningStatusByRound[previousIndex] : true;

    const thisRoundDone = round.seeds.every((seed) => {
      const thisMatchIsBye = seed.teams.some((team) => team.status === "bye");
      const thisMatchHasWinner = seed.teams.some((team) => Boolean(team.win));
      const thisMatchAllWait = seed.teams.every((team) => team.status === "wait");
      const isDone = thisMatchIsBye || thisMatchHasWinner || (previousStatus && thisMatchAllWait);
      return isDone;
    });

    winningStatusByRound.push(thisRoundDone);
  }

  const thirdPlaceRoundIndex = winningStatusByRound.length - 1;
  const finalRoundIndex = thirdPlaceRoundIndex - 1;
  const semiFinalIndex = finalRoundIndex - 1;

  const ongoingIndex = _getOngoingIndex(winningStatusByRound);

  // Belum kelihatan di perebutan juara 3 ada pemenang apa enggak
  if (ongoingIndex <= semiFinalIndex) {
    return defaultValue;
  }

  const thirdPlaceSeed = data.rounds[thirdPlaceRoundIndex].seeds[0];
  return _checkSeedHasWinner(thirdPlaceSeed);
}

/**
 * Yang ongoing harusnya satu round setelah round
 * yang match-nya udah dapat pemenang semua
 */
function _getOngoingIndex(statusByRound) {
  let foundIndex = 0;
  const rounds = [...statusByRound];
  for (const index in rounds) {
    const status = rounds[index];
    const lastIndex = statusByRound.length - 1;
    if (status === true && parseInt(index) < lastIndex) {
      continue;
    }
    foundIndex = parseInt(index);
    break;
  }
  return foundIndex;
}

function _checkSeedHasWinner(seed) {
  const hasPlayerName = seed.teams.some((player) => Boolean(player.name));
  if (hasPlayerName) {
    const winIndex = seed.teams.findIndex((team) => Boolean(team.win));
    const playerIndex = seed.teams.findIndex((player) => Boolean(player.name));
    const foundIndex = winIndex > -1 ? winIndex : playerIndex > -1 ? playerIndex : -1;
    return {
      hasWinner: hasPlayerName,
      winnerIndex: foundIndex,
    };
  }

  const hasTeamName = seed.teams.some((team) => Boolean(team.teamName));
  if (hasTeamName) {
    const winIndex = seed.teams.findIndex((team) => Boolean(team.win));
    const teamIndex = seed.teams.findIndex((team) => Boolean(team.teamName));
    const foundIndex = winIndex > -1 ? winIndex : teamIndex > -1 ? teamIndex : -1;
    return {
      hasWinner: hasTeamName,
      winnerIndex: foundIndex,
    };
  }

  return { hasWinner: false, winnerIndex: -1 };
}

export { MatchBracket };

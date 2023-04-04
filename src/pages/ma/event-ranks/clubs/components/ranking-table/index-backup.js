import * as React from "react";
import styled from "styled-components";
import { useEventRanksClubs } from "../../hooks/event-ranks-clubs";

import { AvatarDefault } from "components/ma";
import { FullPageLoadingIndicator } from "../../../components/portal-loading";

import IconMedalGold from "components/ma/icons/color/medal-gold";
import IconMedalSilver from "components/ma/icons/color/medal-silver";
import IconMedalBronze from "components/ma/icons/color/medal-bronze";

import { misc } from "utils";

function RankingTable({ eventId, params, eventDetail }) {
  const { data: rankedClubs, isLoading: isLoadingRankedClubs } =
    useEventRanksClubs(eventId, params);
  const { registerQueue, checkIsPending, onLoad, onError } =
    useQueueHeavyImageList();

  if (!eventId) {
    return (
      <SectionTableContainer>
        <ScoringEmptyBar>
          Tidak dapat membaca data event. ID event tidak valid.
        </ScoringEmptyBar>
      </SectionTableContainer>
    );
  }

  if (!rankedClubs) {
    return (
      <SectionTableContainer>
        <FullPageLoadingIndicator isLoading={isLoadingRankedClubs} />
        <ScoringEmptyBar>Memproses data pemeringkatan...</ScoringEmptyBar>
      </SectionTableContainer>
    );
  }

  return (
    <SectionTableContainer>
      <FullPageLoadingIndicator isLoading={isLoadingRankedClubs} />

      {rankedClubs && (
        <React.Fragment>
          <FullPageLoadingIndicator isLoading={isLoadingRankedClubs} />

          <TableHeadScores>
            <div>
              <span>Peringkat</span>
              <span className="text-uppercase">
                {eventDetail.parentClassificationTitle}
              </span>
            </div>

            <div>
              <span>
                <IconMedalGold size="28" />
              </span>
              <span>
                <IconMedalSilver size="28" />
              </span>
              <span>
                <IconMedalBronze size="28" />
              </span>
              <span className="text-uppercase">Total</span>
            </div>
          </TableHeadScores>

          {isLoadingRankedClubs ? (
            <EmptyRank>Sedang memuat data pemeringkatan...</EmptyRank>
          ) : rankedClubs.length > 0 ? (
            <RanksList>
              {rankedClubs.map((club, index) => {
                console.log("club:", club);
                return (
                  <li key={index}>
                    <RankItem>
                      <BlockRankNo>{index + 1}</BlockRankNo>
                      <BlockMain>
                        {!club.withContingent ? (
                          <BlockClub>
                            <BlockAvatar>
                              <AvatarContainer>
                                {club.clubLogo ? (
                                  <HeavyImage
                                    src={club.clubLogo}
                                    onRegisterQueue={() => registerQueue(index)}
                                    onLoad={onLoad}
                                    onError={onError}
                                    isPending={checkIsPending(index)}
                                    fallback={
                                      <AvatarDefault fullname={club.clubName} />
                                    }
                                  />
                                ) : (
                                  <AvatarDefault fullname={club.clubName} />
                                )}
                              </AvatarContainer>
                            </BlockAvatar>

                            <BlockClubInfo>
                              <ArcherName>{club.clubName}</ArcherName>
                              <CityName>{club.clubCity}</CityName>
                            </BlockClubInfo>
                          </BlockClub>
                        ) : (
                          <div className="d-flex align-items-center">
                            {club.contingentLogo ? (
                              <ContingenImage
                                src={club.contingentLogo}
                                height={60}
                              />
                            ) : (
                              <AvatarDefault fullname={club.contingentName} />
                            )}

                            <ContingentName>
                              {club.contingentName}
                            </ContingentName>
                          </div>
                        )}

                        <BlockPoints>
                          <BlockMedalCounts>
                            <IconMedalGold size="16" /> {club.gold}
                          </BlockMedalCounts>
                          <BlockMedalCounts>
                            <IconMedalSilver size="16" /> {club.silver}
                          </BlockMedalCounts>
                          <BlockMedalCounts>
                            <IconMedalBronze size="16" /> {club.bronze}
                          </BlockMedalCounts>
                          <span>{club.total}</span>
                        </BlockPoints>
                      </BlockMain>
                    </RankItem>
                  </li>
                );
              })}
            </RanksList>
          ) : (
            <EmptyRank>Belum ada data pemeringkatan di kategori ini</EmptyRank>
          )}
        </React.Fragment>
      )}
    </SectionTableContainer>
  );
}

function BlockRankNo({ children }) {
  const renderRankNumber = (number) => {
    if (number < 10 && number >= 0) {
      return "0" + number;
    }
    return number;
  };

  return (
    <StyledBlockRankNo>
      <span>{renderRankNumber(children)}</span>
    </StyledBlockRankNo>
  );
}

function HeavyImage({
  onRegisterQueue,
  src,
  onLoad,
  onError,
  isPending = false,
  fallback = null,
}) {
  React.useEffect(() => {
    onRegisterQueue?.();
  }, []);

  if (isPending) {
    return fallback || <span>Loading</span>;
  }
  return <img src={src} onLoad={onLoad} onError={onError} />;
}

const SectionTableContainer = styled.div`
  position: relative;
`;

const TableHeadScores = styled.div`
  display: none;
  text-align: center;

  @media (min-width: 721px) {
    display: flex;
    margin: 0.5rem 0;
    background-color: var(--ma-primary-blue-50);
    font-weight: 600;

    > *:first-child {
      flex-grow: 1;

      display: flex;
      align-items: stretch;
      justify-content: flex-start;

      > * {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem;
      }
    }

    > *:last-child {
      > * {
        display: inline-block;
        padding: 0.75rem;
        min-width: calc(3rem + 2 * 0.75rem);
      }
    }
  }
`;

const ScoringEmptyBar = styled.div`
  padding: 0.8125rem 0.625rem;
  font-size: 0.875em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const EmptyRank = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
  color: var(--ma-gray-400);
`;

const RanksList = styled.ul`
  list-style: none;
  margin: 0;
  margin-top: 0.5rem;
  padding: 0;

  > li + li {
    margin-top: 0.625rem;
  }
`;

const RankItem = styled.div`
  display: flex;

  > *:first-child {
    flex-shrink: 0;
  }

  > *:last-child {
    flex-grow: 1;
  }
`;

const StyledBlockRankNo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 3.75rem;
  padding: 0.5rem;

  > span {
    font-size: 1rem;
    font-weight: 600;
  }
`;

const BlockMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #ffffff;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    flex-shrink: 0;
  }

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

const BlockClub = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem 1rem;

  > *:last-child {
    flex-grow: 1;
  }
`;

const BlockAvatar = styled.div`
  padding: 1rem;
  padding-right: 0;
`;

const AvatarContainer = styled.div`
  overflow: hidden;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--ma-gray-50);

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BlockClubInfo = styled.div`
  padding: 1rem;
`;

const ArcherName = styled.h6`
  margin: 0;
  font-weight: 600;
`;

const ContingentName = styled.label`
  font-size: 0.9rem;
  font-weight: bold;
`;

const ContingenImage = styled.img`
  margin: 0.5rem 4rem 0.5rem 3.2rem;
`;

const CityName = styled.div`
  font-size: 13px;
  color: var(--ma-gray-400);
`;

const BlockPoints = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 1.25rem;

  > * {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem;
    min-width: calc(3rem + 2 * 0.75rem);
    text-align: center;
  }
`;

const BlockMedalCounts = styled.span`
  > *:first-child {
    @media (min-width: 721px) {
      display: none;
    }
  }
`;

function useQueueHeavyImageList() {
  const [state, dispatch] = React.useReducer(queueReducer, {
    queue: [],
    index: 0,
    loaded: [],
    errors: [],
  });
  const { queue, index: currentQueueIndex } = state;

  const registerQueue = (index) =>
    dispatch({ type: "REGISTER_QUEUE", payload: index });

  const checkIsPending = (imageIdentifier) => {
    const indexInQueue = queue.indexOf("" + imageIdentifier);
    const foundInQueue = indexInQueue > -1;
    return !foundInQueue || indexInQueue > currentQueueIndex;
  };

  const onLoad = async () => {
    await misc.sleep(500);
    dispatch({ type: "IMAGE_LOADED" });
  };

  const onError = () => {
    dispatch({ type: "IMAGE_ERROR" });
  };

  return { checkIsPending, registerQueue, onLoad, onError };
}

function queueReducer(state, action) {
  if (action.type === "REGISTER_QUEUE") {
    return {
      ...state,
      queue: [...state.queue, "" + action.payload],
    };
  }

  if (action.type === "IMAGE_LOADED") {
    const { queue: currentQueue, index: currentIndex } = state;
    const tempNextIndex = currentIndex + 1;
    const nextIndex =
      tempNextIndex >= currentQueue ? currentIndex : tempNextIndex;
    return {
      ...state,
      index: nextIndex,
      loaded: [...state.loaded, currentIndex],
    };
  }

  return state;
}

export { RankingTable };

import * as React from "react";
import styled from "styled-components";
import { useRankedMembers } from "../../hooks/ranked-members";

import { AvatarDefault, AlertSubmitError } from "components/ma";
import { FullPageLoadingIndicator } from "../portal-loading";

import IconMedalGold from "components/ma/icons/color/medal-gold";
import IconMedalSilver from "components/ma/icons/color/medal-silver";
import IconMedalBronze from "components/ma/icons/color/medal-bronze";

import { misc } from "utils";

function RankingTable({ categoryDetail, series }) {
  const { id: categoryId } = categoryDetail || {};
  const {
    data: rankedMembers,
    isLoading: isLoadingRankedMembers,
    isError,
    errors,
  } = useRankedMembers(categoryId);
  const { registerQueue, checkIsPending, onLoad, onError } = useQueueHeavyImageList();

  if (!categoryDetail || isError || (rankedMembers && !rankedMembers.length)) {
    return (
      <SectionTableContainer>
        <FullPageLoadingIndicator isLoading={isLoadingRankedMembers} />
        <ScoringEmptyBar>Tidak ada data</ScoringEmptyBar>
        <AlertSubmitError isError={isError} errors={errors} />
      </SectionTableContainer>
    );
  }

  if (!rankedMembers) {
    return (
      <SectionTableContainer>
        <FullPageLoadingIndicator isLoading={isLoadingRankedMembers} />
        <ScoringEmptyBar>Memproses data pemeringkatan...</ScoringEmptyBar>
      </SectionTableContainer>
    );
  }

  return (
    <SectionTableContainer>
      <FullPageLoadingIndicator isLoading={isLoadingRankedMembers} />

      {rankedMembers && (
        <React.Fragment>
          <FullPageLoadingIndicator isLoading={isLoadingRankedMembers} />

          {isLoadingRankedMembers ? (
            <EmptyRank>Sedang memuat data pemeringkatan...</EmptyRank>
          ) : rankedMembers.length > 0 ? (
            <RanksList>
              {rankedMembers.map((member, index) => (
                <li key={member.user.id}>
                  <RankItem>
                    <BlockRankNo>{index + 1}</BlockRankNo>

                    <BlockMain>
                      <BlockAvatar>
                        <AvatarContainer>
                          {member.user.avatar ? (
                            <HeavyImage
                              src={member.user.avatar}
                              onRegisterQueue={() => registerQueue(index)}
                              onLoad={onLoad}
                              onError={onError}
                              isPending={checkIsPending(index)}
                              fallback={<AvatarDefault fullname={member.user.name} />}
                            />
                          ) : (
                            <AvatarDefault fullname={member.user.name} />
                          )}
                        </AvatarContainer>
                      </BlockAvatar>

                      <BlockData>
                        <div>
                          <ArcherName>{member.user.name}</ArcherName>
                          <CityName>{member.user.city}</CityName>
                        </div>

                        {series?.id === 2 ? (
                          <RankPoints>
                            <LabelRank>{member.totalPerSeries[0].pointDetails.elimination || 0}</LabelRank>
                            <LabelRank>{member.totalPerSeries[0].pointDetails.qualification || 0}</LabelRank>
                            <LabelBoldRank>{(member.totalPerSeries[0].pointDetails.elimination + member.totalPerSeries[0].pointDetails.qualification) || 0}</LabelBoldRank>
                          </RankPoints>
                        ) : (
                          <BlockPoints>
                            {index === 0 ? (
                              <IconMedalGold size="28" />
                            ) : index === 1 ? (
                              <IconMedalSilver size="28" />
                            ) : index === 2 ? (
                              <IconMedalBronze size="28" />
                            ) : null}
                            {member.totalPoint}
                          </BlockPoints>
                        )}

                      </BlockData>
                    </BlockMain>
                  </RankItem>
                </li>
              ))}
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

function HeavyImage({ onRegisterQueue, src, onLoad, onError, isPending = false, fallback = null }) {
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
  margin-top: 1rem;
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

const LabelBoldRank = styled.span`
  font-weight: 600;
`
const LabelRank = styled.span`
  margin-right: 3rem;
`

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
    flex-shrink: 0;
  }

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

const BlockData = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem 1rem;
  padding: 1rem;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    flex-shrink: 0;
  }
`;

const ArcherName = styled.h6`
  margin: 0;
  font-weight: 600;
`;

const CityName = styled.div`
  font-size: 13px;
  color: var(--ma-gray-400);
`;

const BlockPoints = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
`;

const RankPoints = styled.div`
  font-size: 1rem;
`;

function useQueueHeavyImageList() {
  const [state, dispatch] = React.useReducer(queueReducer, {
    queue: [],
    index: 0,
    loaded: [],
    errors: [],
  });
  const { queue, index: currentQueueIndex } = state;

  const registerQueue = (index) => dispatch({ type: "REGISTER_QUEUE", payload: index });

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
    const nextIndex = tempNextIndex >= currentQueue ? currentIndex : tempNextIndex;
    return {
      ...state,
      index: nextIndex,
      loaded: [...state.loaded, currentIndex],
    };
  }

  return state;
}

export { RankingTable };

import * as React from "react";
import styled from "styled-components";
import { useCategoryDetails } from "../hooks/category-details";
import { useCategoriesWithFilters } from "../hooks/category-filters";

import { SpinnerDotBlock } from "components/ma";

import classnames from "classnames";
import { datetime } from "utils";

function MainCardEvent({ eventDetail }) {
  const { data: eventCategories, isLoading } = useCategoryDetails(eventDetail?.id);

  const {
    activeCategoryDetails,
    optionsCompetitionCategory,
    optionsAgeCategory,
    selectOptionCompetitionCategory,
    selectOptionAgeCategory,
  } = useCategoriesWithFilters(eventCategories);

  const isPreparingCategories = !eventCategories && isLoading;
  const dateEventStart = datetime.formatFullDateLabel(eventDetail?.eventStartDatetime);
  const dateEventEnd = datetime.formatFullDateLabel(eventDetail?.eventEndDatetime);

  return (
    <ContentSheet>
      <VerticalSpaced>
        <div>
          <EventHeadingGroup>
            <div>
              <EventNameHeading>{eventDetail?.eventName}</EventNameHeading>
            </div>
            <div>
              <CompetitionTypeLabel>{eventDetail?.eventCompetition}</CompetitionTypeLabel>
            </div>
          </EventHeadingGroup>

          <SubHeadingInfo>
            <span>
              {eventDetail ? (
                <React.Fragment>
                  {dateEventStart} &ndash; {dateEventEnd}
                </React.Fragment>
              ) : (
                "tanggal tidak tersedia"
              )}
            </span>
            <span>&#124;</span>
            <span>{eventDetail?.location}</span>
          </SubHeadingInfo>

          <div>Oleh {eventDetail?.detailAdmin?.name}</div>
        </div>

        <BlockCategories>
          {isPreparingCategories ? (
            <SpinnerDotBlock />
          ) : !eventCategories ? (
            <div>Tidak ada data kategori</div>
          ) : (
            <React.Fragment>
              <CompetitionCategoryBar>
                <ScrollableCategoryBar>
                  {optionsCompetitionCategory.map((filter) => (
                    <CompetitionCategoryItem
                      key={filter.competitionCategory}
                      onClick={() => {
                        if (filter.isActive) {
                          return;
                        }
                        selectOptionCompetitionCategory(filter.competitionCategory);
                      }}
                      className={classnames({ "filter-category-active": filter.isActive })}
                    >
                      <span>{filter.competitionCategory}</span>
                    </CompetitionCategoryItem>
                  ))}
                </ScrollableCategoryBar>
              </CompetitionCategoryBar>

              <AgeCategoryBar>
                <ScrollableAgeCategoryBar>
                  {optionsAgeCategory.map((filter) => (
                    <AgeCategoryItem
                      key={filter.ageCategory}
                      onClick={() => {
                        if (filter.isActive) {
                          return;
                        }
                        selectOptionAgeCategory(filter.ageCategory);
                      }}
                      className={classnames({ "age-filter-active": filter.isActive })}
                    >
                      {filter.ageCategory}
                    </AgeCategoryItem>
                  ))}
                </ScrollableAgeCategoryBar>
              </AgeCategoryBar>

              <QuotaBar>
                <QuotaHeading>Kuota Pertandingan</QuotaHeading>
                <QuotaGrid>
                  {activeCategoryDetails.map((categoryDetail) => (
                    <QuotaItem key={categoryDetail.categoryDetailId}>
                      <TeamCategoryLabel>{categoryDetail.teamCategoryLabel}</TeamCategoryLabel>
                      {!categoryDetail.quota ? (
                        <QuotaAmountMuted>Kuota tidak tersedia</QuotaAmountMuted>
                      ) : !categoryDetail.remainingQuota ? (
                        <QuotaAmountMuted>Penuh</QuotaAmountMuted>
                      ) : (
                        <QuotaAmount>
                          Tersedia: {categoryDetail.remainingQuota}/{categoryDetail.quota}
                        </QuotaAmount>
                      )}
                    </QuotaItem>
                  ))}
                </QuotaGrid>
              </QuotaBar>
            </React.Fragment>
          )}
        </BlockCategories>
      </VerticalSpaced>
    </ContentSheet>
  );
}

/* Styled components */

const ContentSheet = styled.div`
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  color: var(--ma-text-black);
`;

const VerticalSpaced = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const EventHeadingGroup = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  gap: 1rem;

  > *:last-child {
    flex-shrink: 0;
  }

  @media (min-width: 562px) {
    flex-direction: row;
  }

  @media (min-width: 769px) {
    flex-direction: column-reverse;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const EventNameHeading = styled.h1`
  color: var(--ma-blue);
  font-size: 1.125rem;
  font-weight: 600;

  @media (min-width: 426px) {
    font-size: 1.875rem;
  }
`;

const CompetitionTypeLabel = styled.div`
  min-width: max-content;
  padding: 0.125rem 0.75rem;
  color: var(--ma-text-black);
  background-color: #ffcf70;
  border-radius: 1.5rem;

  @media (min-width: 562px) {
    margin-top: 0.5rem;
  }

  @media (min-width: 769px) {
    margin-top: 0;
  }

  @media (min-width: 1024px) {
    margin-top: 0.5rem;
  }
`;

const SubHeadingInfo = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;

  > * + * {
    margin-left: 0.625rem;
  }

  @media (min-width: 562px) {
    font-size: 1.125rem;
  }

  @media (min-width: 769px) {
    font-size: 0.8125rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.125rem;
  }
`;

const BlockCategories = styled.div`
  > * + * {
    margin-top: 0.75rem;
  }
`;

const CompetitionCategoryBar = styled.div`
  overflow-x: auto;
  padding: 0 0.875rem;
  background-color: var(--ma-primary-blue-50);
  border-radius: 0.5rem;
`;

const ScrollableCategoryBar = styled.div`
  margin: 0 auto;
  width: max-content;
  display: flex;

  @media (min-width: 1024px) {
    margin: 0;
    width: auto;

    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
`;

const CompetitionCategoryItem = styled.button`
  border: none;
  background-color: transparent;
  padding: 1.125rem 1.125rem;
  margin: 0;

  color: #90aad4;
  font-weight: 600;
  font-size: 0.875rem;

  transition: all 0.2s;

  @media (min-width: 562px) {
    font-size: 1.125rem;
  }

  &:hover {
    > span {
      transition: all 0.2s;
      color: var(--ma-blue);
    }
  }

  > span {
    border-bottom: 2px solid transparent;
  }

  &.filter-category-active {
    color: var(--ma-blue);
    font-weight: 600;
    cursor: pointer;

    > span {
      display: inline-block;
      border-color: var(--ma-secondary);
      transform: translateY(-0.25rem);
      transition: all 0.2s;
    }
  }

  @media (min-width: 562px) {
    padding: 0.75rem 1.125rem;
  }
`;

const AgeCategoryBar = styled.div`
  overflow-x: auto;
  padding: 0.75rem;

  @media (min-width: 1024px) {
    overflow-x: visible;
  }
`;

const ScrollableAgeCategoryBar = styled.div`
  margin: 0 auto;
  width: max-content;
  display: flex;
  gap: 0.5rem;

  @media (min-width: 1024px) {
    margin: 0;
    width: auto;

    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
`;

const AgeCategoryItem = styled.button`
  padding: 0.625rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  background-color: transparent;

  color: var(--ma-gray);
  font-size: 0.875rem;
  font-weight: 600;

  transition: all 0.2s;

  &:hover {
    border: 1px solid var(--ma-gray);
  }

  @media (min-width: 562px) {
    padding: 0.125rem 0.625rem;
    font-size: 1.125rem;
  }

  &.age-filter-active {
    border: 1px solid var(--ma-secondary);
    background-color: #fff8e9;
    color: var(--ma-secondary);
  }
`;

const QuotaBar = styled.div`
  > * + * {
    margin-top: 0.75rem;
  }
`;

const QuotaHeading = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.375rem;
  background-color: var(--ma-gray-50);

  color: var(--ma-blue);
  font-size: 1.125rem;
  font-weight: 600;
`;

const QuotaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: 0.625rem;
`;

const QuotaItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;

  padding: 0.5rem 0.7rem;
  border: 1px solid #eeeeee;
  border-radius: 0.5rem;
  text-align: center;
`;

const TeamCategoryLabel = styled.div`
  color: var(--ma-blue);
  font-size: 0.875rem;
  font-weight: 600;
`;

const QuotaAmount = styled.div`
  padding: 0.125rem 0.5rem;
  background-color: #aeddc2;
  border-radius: 1.5rem;
  font-size: 0.75rem;
`;

const QuotaAmountMuted = styled.div`
  padding: 0.125rem 0.5rem;
  background-color: var(--ma-gray-200);
  border-radius: 1.5rem;
  font-size: 0.75rem;
`;

export { MainCardEvent };

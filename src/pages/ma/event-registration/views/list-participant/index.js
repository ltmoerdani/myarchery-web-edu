import React from "react";
import styled from "styled-components";
import MultiListParticipant from "./multi-list-participant";
import SingleListParticipant from "./single-list-participant";
import TeamListParticipant from "./team-list-participant";

const ListParticipant = ({
  formOrder,
  wizardView,
  eventDetailData,
  userProfile,
}) => {
  const { selectCategoriesType, isCollective } = formOrder.data;
  return (
    <>
      {selectCategoriesType === "team" ||
      selectCategoriesType === "mix" ||
      isCollective ? (
        <HeaderWrapper>
          <HeaderTitleText>Data Peserta</HeaderTitleText>
          <HeaderSubtitleText>
            Silakan periksa kembali kelengkapan data peserta dan lengkapi data
            peserta yang belum memiliki email
          </HeaderSubtitleText>
        </HeaderWrapper>
      ) : null}
      <ContentCard>
        {selectCategoriesType === "individual" && isCollective === false ? (
          <SingleListParticipant
            formOrder={formOrder}
            wizardView={wizardView}
            eventDetailData={eventDetailData}
            userProfile={userProfile}
          />
        ) : selectCategoriesType === "team" ||
          selectCategoriesType === "mix" ? (
          <TeamListParticipant
            formOrder={formOrder}
            wizardView={wizardView}
            eventDetailData={eventDetailData}
          />
        ) : selectCategoriesType === "individual" && isCollective === true ? (
          <MultiListParticipant
            formOrder={formOrder}
            wizardView={wizardView}
            eventDetailData={eventDetailData}
            userProfile={userProfile}
          />
        ) : null}
      </ContentCard>
    </>
  );
};

const ContentCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  padding-bottom: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0 1.75rem 0;
`;

const HeaderTitleText = styled.h1`
  color: #545454;
  font-weight: 600;
  font-size: 20px;
`;

const HeaderSubtitleText = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #545454;
`;

export default ListParticipant;

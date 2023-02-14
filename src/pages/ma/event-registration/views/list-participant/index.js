import React from "react";
import styled from "styled-components";
import SingleListParticipant from "./single-list-participant";

const ListParticipant = ({
  formOrder,
  wizardView,
  eventDetailData,
  userProfile,
}) => {
  return (
    <ContentCard>
      <div>asds</div>
      <SingleListParticipant
        formOrder={formOrder}
        wizardView={wizardView}
        eventDetailData={eventDetailData}
        userProfile={userProfile}
      />
    </ContentCard>
  );
};

const ContentCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  padding-bottom: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

// const groupParticipant = (data = []) => {
//   if (!data.length) return;
//   // const registeredParticipant
//   for (const participant of data) {
//     console.log(participant);
//   }
//   return data;
// };

// const checkEmailIndividuParticipant = async (email) => {
//   console.log(email);
//   if (!email) return;
//   let result = { status: "idle", errors: null, data: null };
//   try {
//     result = { status: "loading", errors: null, data: null };
//     const payload = { emails: [email] };
//     const response = await OrderEventService.checkEmailRegister(payload);
//     if (response?.data && response.data[0]?.message) {
//       result = {
//         status: "success",
//         errors: null,
//         data: response.data[0],
//       };
//       console.log(result);
//       return result;
//     }
//   } catch (error) {
//     return error?.message;
//   }
// };

export default ListParticipant;

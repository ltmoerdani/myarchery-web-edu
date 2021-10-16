import React, { useState, useEffect } from "react";
import HeaderForm from "layouts/landingpage/HeaderForm";
import FormFullday from "./components/FormFullday";
import { Container, Row } from "reactstrap";
import styled from "styled-components";
import { stringUtil } from "utils";
import { CategoryService } from "services";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";
import * as ArcherStore from "store/slice/archer"

const H5 = styled.h5`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 120%;
  text-align: center;
  color: #495057;
`;

const RegisterFullday = () => {
  const { slug } = useParams();
  const [eventDetail, setEventDetail] = useState();
  let { userProfile } = useSelector(getAuthenticationStore);

  const {data} = useSelector(ArcherStore.getArcherStore)
  console.log(data)

  const [eventData, setEventData] = useState({
    eventType: "fullday",
    type: "",
    email: userProfile?.email,
    phone: userProfile?.phoneNumber,
    clubName: "",
    teamName: "",
    isUserSamePlayer: true,
    category: "",
    gender: "",
    dateBirth: "",
    participantMembers: [
      {
        name: userProfile?.name,
        birthdate: userProfile?.dateOfBirth,
        gender: "",
      },
    ],
    categoryEvent: data,
    eventCategories: [
      {
        id: stringUtil.createRandom(),
        competitionCategories: [
          {
            id: stringUtil.createRandom(),
          },
        ],
      },
    ],
    team_category_id: "individu",
  });

  const handleChange = (key, value) => {
    let modifiedEventData = { ...eventData };
    if (key === "registrationFees" || key === "teamCategories") {
      const registrationFees =
        key === "registrationFees" ? value : eventData.registrationFees;
      const categories =
        key === "teamCategories" ? value : eventData.teamCategories;

      const newRegistrationFees = registrationFees.map((item) => {
        const newItem = {
          registrationType: item.registrationType || item.id,
          id: item.id,
          label: item.label,
          price: item.price,
        };
        newItem.categoryPrices = categories.map((categoryItem) => {
          return {
            id: categoryItem.id,
            label: categoryItem.label,
            teamCategory: categoryItem.id,
            price: undefined,
          };
        });

        return newItem;
      });

      modifiedEventData.teamCategories = categories;
      modifiedEventData.registrationFees = newRegistrationFees;
    } else {
      modifiedEventData = _.set(modifiedEventData, key, value);
    }
    setEventData(modifiedEventData);
  };

  useEffect(async () => {
    try {
      const slugData = { slug };
      const { data, errors, success, message } = await CategoryService.get(
        slugData
      );

      if (success) {
        if (data) {
          setEventDetail(data);
        }
      } else {
        console.log(message, errors);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <React.Fragment>
      {/* import navbar */}
      <HeaderForm />

      <Row className="mt-3">
        <H5>
          Pendaftaran{" "}
          {eventDetail && eventDetail.eventName != undefined
            ? eventDetail.eventName
            : ""}
        </H5>
      </Row>

      <Container fluid className="px-5 p-2">
        <FormFullday
          onFormFieldChange={(key, value) => handleChange(key, value)}
          formData={eventData}
          eventDetail={eventDetail}
          slug={slug}
        />
      </Container>
    </React.Fragment>
  );
};

export default RegisterFullday;

import {
  // SwitchInput,
  TextInput,
  RadioButtonInput,
  DateInput,
  Button,
} from "components";
import React from "react";
import { Col, Row, Label } from "reactstrap";
import { selectConstants } from "constants/index";
import { stringUtil } from "utils";

export const FulldayFormStep1 = ({
  onFormFieldChange,
  formData,
}) => {
  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  function handleAddCompetitionCategory(categoryIndex) {
    const categoryList = [...formData.eventCategories];
    categoryList[categoryIndex].competitionCategories.push({
      id: stringUtil.createRandom(),
    });
    handleChange({
      key: "eventCategories",
      value: categoryList,
    });
  }

  function handleRemoveCompetitionCategory(
    categoryIndex,
    competitionCategoryIndex
  ) {
    const categoryList = [...formData.eventCategories];
    categoryList[categoryIndex].competitionCategories.splice(
      competitionCategoryIndex,
      1
    );
    handleChange({
      key: "eventCategories",
      value: categoryList,
    });
  }

  return (
    <Row>
      <Col lg={12}>
        <label>Daftar Sebagai?</label>
        <RadioButtonInput
          name="type"
          onChange={handleChange}
          options={selectConstants.fulldayAudience}
          checked={selectConstants.fulldayAudience[0].id === formData.type.id}
          value={formData.type}
        />
      </Col>
      {/* <Label>Kategori Lomba</Label>
      <Row>
        <SelectInput
        className="overflow-auto"
          options={
            eventDetail?.flatCategories?.map((option) => {
              return {
                ...option,
                id: `${option.teamCategoryId}.${option.ageCategoryId}.${option.competitionCategoryId}.${option.distanceId}`,
                label: option.archeryEventCategoryLabel,
              };
            }) || []
          }
          name="categoryEvent"
          onChange={handleChange}
          value={formData.categoryEvent}
        />
      </Row> */}
      <Col lg={6}>
        <TextInput
          label="Email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
        />
      </Col>
      <Col lg={6}>
        <TextInput
          label="No. Telepon"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
        />
      </Col>
      <Col lg={6}>
        <TextInput
          label="Nama Klub"
          name="clubName"
          value={formData.clubName || ""}
          onChange={handleChange}
        />
      </Col>

      {/* <Col lg={12}>
          <SwitchInput
            label="Nama peserta sama dengan pemilik akun "
            name="isUserSamePlayer"
            onChange={handleChange}
            options={selectConstants.confirmation}
            inline
            value={formData.isFlatRegistrationFee}
          />
        </Col> */}

      {formData.type.id === "Tim" ? (
        <Col lg={4}>
          <TextInput
            label="Nama Tim"
            name="teamName"
            value={formData.city || ""}
            onChange={handleChange}
          />
        </Col>
      ) : (
        <>
          <Col lg={6}>
            <TextInput
              label="Nama Peserta"
              name="participantMembers.0.name"
              value={formData.participantMembers[0].name || ""}
              onChange={handleChange}
            />
          </Col>

          <Col lg={6}>
            <DateInput
              label="Tanggal Lahir"
              name="participantMembers.0.birthdate"
              value={formData.participantMembers[0].birthdate}
              onChange={handleChange}
            />
          </Col>

          <Col lg={6}>
            <label>Jenis Kelamin</label>
            <RadioButtonInput
              name="participantMembers.0.gender"
              onChange={handleChange}
              options={selectConstants.gender}
              value={formData.participantMembers[0].gender}
            />
          </Col>
        </>
      )}

      {formData.type.id === "Tim" &&
        formData.eventCategories.map((eventCategory, index) => (
          <Row key={index}>
            <Label className="mt-2">Nama Peserta (Tim)</Label>
            <Col>
              {eventCategory.competitionCategories.map(
                (competitionCategory, competitionCategoryIndex) => {
                  return (
                    <Row key={competitionCategory.id}>
                      <Col lg={4}>
                        <TextInput
                          name={`eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.competitionCategory`}
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </Col>

                      <Col lg={4}>
                        <div>
                          <Button
                            onClick={() => {
                              handleAddCompetitionCategory(index);
                            }}
                            icon="copy"
                            outline
                          />{" "}
                          {eventCategory.competitionCategories.length > 1 && (
                            <Button
                              onClick={() => {
                                handleRemoveCompetitionCategory(
                                  index,
                                  competitionCategoryIndex
                                );
                              }}
                              icon="trash"
                              type="danger"
                              outline
                            />
                          )}
                        </div>
                      </Col>
                    </Row>
                  );
                }
              )}
            </Col>
          </Row>
        ))}
    </Row>
  );
};

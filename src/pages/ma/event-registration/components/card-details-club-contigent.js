import React from "react";
import { Label } from "reactstrap";
import styled from "styled-components";
import { checkIsIndividu } from "../utils";
import { FieldErrorMessage } from "./field-error-message";
import { FieldSelectClub } from "./field-select-club";
import { FieldSelectKontingen } from "./field-select-kontingen";
import { SelectChildrenClassifiaction } from "./select-children-classification";
import { SelectRadio } from "./select-radio";
import { Show } from "./show-when";

const DetailsClubContigent = ({
  formOrder,
  eventDetailData,
  parentClassificationId,
}) => {
  const {
    errors: orderErrors,
    setWithClub,
    setClub,
    setCityId,
    setCountryData,
    setProvinceData,
    setClassificationEvent,
  } = formOrder;
  const {
    category,
    withClub,
    club,
    city_id,
    selectCategoriesType,
    countryData,
    provinceData,
    classificationEvent,
  } = formOrder.data;
  const isCategoryIndividu = checkIsIndividu(category);
  return (
    <div>
      {parentClassificationId === 2 ||
      parentClassificationId === 3 ||
      parentClassificationId === 4 ? (
        <div>
          <FieldSelectKontingen
            provinceId={parseInt(eventDetailData?.classificationProvinceId)}
            required
            value={
              parentClassificationId === 2
                ? countryData
                : parentClassificationId === 3
                ? provinceData
                : city_id
            }
            onChange={
              parentClassificationId === 2
                ? setCountryData
                : parentClassificationId === 3
                ? setProvinceData
                : setCityId
            }
            countryId={eventDetailData?.classificationCountryId}
            parentClassificationId={parentClassificationId}
          />
          <FieldErrorMessage
            errors={
              parentClassificationId === 2
                ? orderErrors.countryData
                : parentClassificationId === 3
                ? orderErrors.provinceData
                : orderErrors.city_id
            }
          />
        </div>
      ) : parentClassificationId === 1 ? (
        <div>
          {selectCategoriesType === "individual" ? (
            <>
              <p>Atur Detail Klub Peserta</p>
              <div style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
                <div>
                  <Label
                    className="form-check-label"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    Apakah Anda mewakili klub?
                  </Label>
                </div>

                <div>
                  <SelectRadio
                    options={[
                      { value: "yes", label: "Iya, saya mewakili klub" },
                      { value: "no", label: "Tidak, saya individu" },
                    ]}
                    value={withClub}
                    onChange={setWithClub}
                  />

                  <FieldErrorMessage errors={orderErrors.withClub} />
                </div>
              </div>
            </>
          ) : null}

          <FieldSelectClub
            required={!category && !isCategoryIndividu}
            disabled={
              selectCategoriesType === "individual"
                ? !category || withClub == "no"
                : false
            }
            value={club}
            onChange={setClub}
            errors={orderErrors.club}
            placeholder={
              selectCategoriesType === "individual" ? "Pilih" : "Pilih klub"
            }
          >
            {selectCategoriesType === "individual"
              ? "Mewakili (Klub/Tim/Kelompok)?"
              : "Pilih Klub yang diwakilkan"}
          </FieldSelectClub>

          <Show when={isCategoryIndividu}>
            <SubtleFieldNote>
              Dapat dikosongkan jika tidak mewakili klub
            </SubtleFieldNote>
          </Show>
        </div>
      ) : (
        <SelectChildrenClassifiaction
          placeholder={"Pilih Klasifikasi"}
          parentId={parentClassificationId}
          value={classificationEvent}
          onChange={setClassificationEvent}
        />
      )}
    </div>
  );
};

const SubtleFieldNote = styled.div`
  color: var(--ma-gray-400);
  font-size: 12px;
  font-weight: 400;
`;

export default DetailsClubContigent;

import React from "react";
import styled from "styled-components";
import { EditName } from "./edit-name-inline";
import { FieldInputText } from "./field-input-text";
import { SelectRadio } from "./select-radio";

const DetailsRegistrant = ({
  handleTypeChangeRegistration,
  onProfileUpdated,
  formOrder,
  userProfile,
}) => {
  const { setAsParticipant } = formOrder;
  const {
    asParticipant,
    registrationType,
    selectCategoryTab,
    selectCategoriesType,
    selectClassCategories,
  } = formOrder.data;
  const shouldRadioDisabled =
    !selectCategoriesType || !selectCategoryTab || !selectClassCategories;
  return (
    <div>
      {userProfile ? (
        <React.Fragment>
          <div>
            <FieldInputText
              placeholder="Nama Pendaftar"
              disabled
              value={userProfile?.name}
              onChange={() => {}}
            >
              Nama Pendaftar
            </FieldInputText>
            <SubtleFieldNote>
              Untuk merubah nama, silakan klik{" "}
              <EditName
                title={_renderEditNameTitle(userProfile?.canUpdateName)}
                onProfileUpdated={onProfileUpdated}
              >
                di sini
              </EditName>
              .
            </SubtleFieldNote>
          </div>
        </React.Fragment>
      ) : (
        <div>Sedang memuat data pengguna...</div>
      )}

      {selectCategoriesType !== "team" ? (
        <SelectRadioSectionWrapper>
          <SelectRadioSectionBox>
            <SelectRadioTitle>Pendaftar ikut sebagai peserta?</SelectRadioTitle>
            <SelectRadio
              options={[
                { value: true, label: "Iya, sebagai peserta" },
                { value: false, label: "Tidak, hanya mendaftarkan" },
              ]}
              defaultValue={true}
              value={asParticipant}
              disabled={shouldRadioDisabled}
              onChange={() => setAsParticipant(!asParticipant)}
            />
          </SelectRadioSectionBox>
          <SelectRadioSectionBox>
            <SelectRadioTitle>Mendaftarkan</SelectRadioTitle>
            <SelectRadio
              options={[
                { value: "individual", label: "Individu" },
                { value: "collective", label: "Kolektif" },
              ]}
              defaultValue={"individual"}
              value={registrationType}
              disabled={shouldRadioDisabled}
              onChange={handleTypeChangeRegistration}
            />
          </SelectRadioSectionBox>
        </SelectRadioSectionWrapper>
      ) : null}
    </div>
  );
};

const SubtleFieldNote = styled.div`
  color: var(--ma-gray-400);
  font-size: 12px;
  font-weight: 400;
`;

const SelectRadioSectionWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  gap: 1.25rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
`;

const SelectRadioSectionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 992px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
  &.details-participant {
    align-items: start;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const SelectRadioTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1c1c;
`;

/* ================================= */
// utils

/**
 * Verifikasi tidak diminta lagi ketika statusnya "terverifikasi" (kode 1)
 * atau "menunggu diverifikasi" (kode 3). Status lainnya akan tetap ditawarkan
 * form untuk isi data verifikasi user.
 * @param {int} verifyStatus 1 | 2 | 3 | 4
 * @returns {Boolean}
 */
// function _checkIsVerificationDone(verifyStatus) {
//   const acceptedStatuses = [1, 3];
//   return acceptedStatuses.indexOf(verifyStatus) > -1;
// }

function _renderEditNameTitle(limitCount) {
  if (!limitCount) {
    return "Telah melebihi limit, tidak dapat lagi mengubah data.";
  }
  return `Tersisa kesempatan mengubah data ${limitCount} kali.`;
}

export default DetailsRegistrant;

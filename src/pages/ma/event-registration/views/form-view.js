import * as React from "react";
import styled from "styled-components";
import { useVerificationDetail } from "../hooks/verification-detail";
import { useFormVerification } from "../hooks/form-verification";

import { Label } from "reactstrap";
import { FieldInputText, FieldSelectCategory, FieldSelectClub } from "../components";
import { Show } from "../components/show-when";
import { FieldErrorMessage } from "../components/field-error-message";
import { PickerMatchDate } from "../components/picker-match-date";
import { FieldSelectNationality } from "../components/field-select-nationality";
import { FieldSelectProvince } from "../components/field-select-province";
import { FieldSelectCity } from "../components/field-select-city";
import { FieldSelectCountry } from "../components/field-select-country";
import { FieldSelectCityByCountry } from "../components/field-select-city-country";
import { FieldUploadImage } from "../components/field-upload-image";
import { SelectRadio } from "../components/select-radio";

import IconAddress from "components/ma/icons/mono/address";

import { checkIsIndividu } from "../utils";

function FormView({ userProfile, eventCategories, formOrder }) {
  const {
    data: formData,
    errors: formErrors,
    updateField,
    setCategory,
    setWithClub,
    setClub,
  } = formOrder;
  const { category, matchDate, withClub, club } = formData;

  const { data: verificationDetail } = useVerificationDetail(userProfile.id);
  const {
    data: formVerification,
    updateField: updateVerification,
    updateNIK,
    updateImage,
    updateWithDependence,
  } = useFormVerification(verificationDetail);

  const { isWna, province, city, nik, address, imageKTP } = formVerification;
  const { wnaCountry, wnaCity, wnaPassportNumber, wnaAddress, imagePassport } = formVerification;

  const isCategoryIndividu = checkIsIndividu(category);
  const isVerificationDone = _checkIsVerificationDone(userProfile.verifyStatus);

  return (
    <ContentCard>
      <MainCardHeader>
        <WrappedIcon>
          <IconAddress />
        </WrappedIcon>
        <MainCardHeaderText>Detail Pendaftaran</MainCardHeaderText>
      </MainCardHeader>

      <FieldSelectCategory
        required
        groupedOptions={eventCategories}
        value={category}
        onChange={(category) => {
          setCategory(category, userProfile);
        }}
        errors={formErrors.category}
      >
        Kategori Lomba
      </FieldSelectCategory>

      <PickerMatchDate
        category={category}
        value={matchDate}
        onChange={(date) => updateField({ matchDate: date })}
        errors={formErrors.matchDate}
      />

      {userProfile ? (
        <React.Fragment>
          <FieldInputText
            placeholder="Nama Pendaftar"
            disabled
            value={userProfile.name}
            onChange={() => {}}
          >
            Nama Pendaftar
          </FieldInputText>

          <SplitFields>
            <SplitFieldItem>
              <FieldInputText
                placeholder="Email"
                disabled
                value={userProfile.email}
                onChange={() => {}}
              >
                Email
              </FieldInputText>
            </SplitFieldItem>

            <SplitFieldItem>
              <FieldInputText
                placeholder="No. Telepon"
                disabled
                value={userProfile.phoneNumber}
                onChange={() => {}}
              >
                No. Telepon
              </FieldInputText>
            </SplitFieldItem>
          </SplitFields>
        </React.Fragment>
      ) : (
        <div>Sedang memuat data pengguna...</div>
      )}

      <Show when={category}>
        <FieldSelectNationality
          value={isWna || 0}
          onChange={(value) => updateVerification("isWna", parseInt(value))}
          disabled={isVerificationDone}
        />

        <Show when={!isWna}>
          <FieldSelectProvince
            value={province}
            onChange={(opt) => updateWithDependence("province", opt, "city")}
            disabled={isVerificationDone}
          />

          <FieldSelectCity
            provinceId={province?.value}
            value={city}
            onChange={(opt) => updateVerification("city", opt)}
            disabled={isVerificationDone || !province?.value}
          />

          <FieldInputText
            label="NIK"
            placeholder="Masukkan 16 digit nomor KTP/KK"
            value={nik}
            onChange={updateNIK}
            disabled={isVerificationDone}
          />

          <FieldUploadImage
            label="Foto KTP/KK"
            placeholder="Unggah gambar dengan file JPG/PNG"
            name="imageKTP"
            value={imageKTP}
            onChange={(value) => updateImage("imageKTP", value)}
            disabled={isVerificationDone}
          />
          <SubtleFieldNote>
            Anda cukup melakukan verifikasi umur sekali di sini. Jika ada perubahan nama, Anda perlu
            mengisi ulang data.
          </SubtleFieldNote>

          <FieldInputText
            label="Alamat Lengkap"
            placeholder="Masukkan alamat sesuai KTP/KK"
            value={address}
            onChange={(value) => updateVerification("address", value)}
            disabled={isVerificationDone}
          />
        </Show>

        <Show when={isWna}>
          <FieldSelectCountry
            label="Negara"
            placeholder="Pilih negara sesuai paspor"
            value={wnaCountry}
            onChange={(opt) => updateWithDependence("wnaCountry", opt, "wnaCity")}
            disabled={isVerificationDone}
          />

          <FieldSelectCityByCountry
            label="Kota (Sesuai dengan paspor)"
            placeholder="Pilih kota"
            countryId={wnaCountry?.value}
            value={wnaCity}
            onChange={(opt) => updateVerification("wnaCity", opt)}
            disabled={isVerificationDone || !wnaCountry?.value}
          />

          <FieldInputText
            label="Nomor Paspor"
            placeholder="Masukkan nomor paspor"
            value={wnaPassportNumber}
            onChange={(value) => updateVerification("wnaPassportNumber", value)}
            disabled={isVerificationDone}
          />

          <FieldUploadImage
            label="Foto Paspor"
            placeholder="Unggah gambar dengan file JPG/PNG"
            name="imagePassport"
            value={imagePassport}
            onChange={(value) => updateImage("imagePassport", value)}
            disabled={isVerificationDone}
          />
          <SubtleFieldNote>
            Anda cukup melakukan verifikasi umur sekali di sini. Jika ada perubahan nama, Anda perlu
            mengisi ulang data.
          </SubtleFieldNote>

          <FieldInputText
            label="Alamat Lengkap"
            placeholder="Masukkan alamat sesuai paspor"
            value={wnaAddress}
            onChange={(value) => updateVerification("wnaAddress", value)}
            disabled={isVerificationDone}
          />
        </Show>
      </Show>

      <div className="mt-5 mb-0">
        <h5>Data Peserta</h5>
        <p>Atur Detail Klub Peserta</p>
      </div>

      <div style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
        <div>
          <Label className="form-check-label" style={{ marginBottom: "0.25rem" }}>
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

          <FieldErrorMessage errors={formErrors.withClub} />
        </div>
      </div>

      <FieldSelectClub
        required={category?.id && !isCategoryIndividu}
        disabled={!category?.id || withClub == "no"}
        value={club}
        onChange={setClub}
        errors={formErrors.club}
      >
        Pilih Klub yang diwakilkan
      </FieldSelectClub>

      <Show when={isCategoryIndividu}>
        <SubtleFieldNote>Dapat dikosongkan jika tidak mewakili klub</SubtleFieldNote>
      </Show>

      <SegmentByTeamCategory
        teamFilters={["individu male", "individu female"]}
        teamCategoryId={category?.teamCategoryId}
      >
        <FieldInputText
          name={"member-individual"}
          placeholder="Nama Peserta"
          disabled
          value={userProfile?.email}
        >
          Peserta
        </FieldInputText>
      </SegmentByTeamCategory>
    </ContentCard>
  );
}

function SegmentByTeamCategory({ children, teamFilters, teamCategoryId }) {
  if (teamFilters.some((filter) => filter === teamCategoryId)) {
    return children;
  }
  return null;
}

/* ======================================= */
// styles

const ContentCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  padding-bottom: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const MainCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const MainCardHeaderText = styled.h4`
  margin: 0;
`;

const WrappedIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: solid 1px #c4c4c4;
`;

const SplitFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.375rem;
`;

const SplitFieldItem = styled.div`
  flex: 1 1 13.75rem;
`;

const SubtleFieldNote = styled.div`
  color: var(--ma-gray-400);
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
function _checkIsVerificationDone(verifyStatus) {
  const acceptedStatuses = [1, 3];
  return acceptedStatuses.indexOf(verifyStatus) > -1;
}

export { FormView };

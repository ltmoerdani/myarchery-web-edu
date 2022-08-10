import * as React from "react";
import styled from "styled-components";
import { useUserProfile } from "hooks/user-profile";
import { useSubmitProfile } from "./hooks/submit-profile";
import { useVerificationDetail } from "./hooks/verification-detail";
import { useFormVerification } from "./hooks/form-verification";
import { useSubmitVerification } from "./hooks/submit-verification";

import { ButtonBlue, SpinnerDotBlock, LoadingScreen } from "components/ma";
import { PageWrapper } from "components/ma/page-wrapper";
import { ErrorBoundary } from "components/ma/error-boundary";
import { toast } from "components/ma/processing-toast";
import { FieldInputText } from "pages/ma/event-registration/components";
import { FieldSelectProvince } from "pages/ma/event-registration/components/field-select-province";
import { FieldSelectCity } from "pages/ma/event-registration/components/field-select-city";
import { FieldUploadImage } from "pages/ma/event-registration/components/field-upload-image";
import { FieldDataEditor } from "./components/field-data-editor";
import { AvatarUploader } from "./components/avatar-uploader";

function PageProfileHome() {
  return (
    <PageWrapper pageTitle="Profil Archer" breadcrumbText="Profil" breadcrumbLink="/dashboard">
      <ErrorBoundary>
        <CardMainProfile />
      </ErrorBoundary>

      <ErrorBoundary>
        <CardDetailProfile />
      </ErrorBoundary>
    </PageWrapper>
  );
}

function CardMainProfile() {
  const { userProfile, refresh } = useUserProfile();

  const {
    submit,
    isLoading: isSubmiting,
    errors: submitErrors,
    reset: resetSubmit,
  } = useSubmitProfile();

  const handleSubmit = (editor, successMessage = "Berhasil menyimpan data") => {
    submit(editor.value, {
      onSuccess: () => {
        toast.success(successMessage);
        editor.close();
        refresh();
      },
    });
  };

  const renderFieldTitle = (shouldRender) => {
    if (!shouldRender) {
      return undefined;
    }
    return "Telah melebihi limit, tidak dapat lagi mengubah data.";
  };

  return (
    <CardSheet>
      <CardTitle>Data Pribadi</CardTitle>

      <ProfileFormLayout>
        <div>
          <AvatarUploader />
          <UploadInstruction>
            Unggah foto Anda dengan ukuran 4x3, min. besar file 500kb, format PNG/JPEG untuk
            keperluan berkas cetak (ID card, dsb).
          </UploadInstruction>
        </div>

        <div>
          <InputGrid>
            <div>
              <FieldDataEditor
                label="Nama Lengkap"
                placeholder="Isi nama lengkap"
                name="name"
                disabled={!userProfile?.canUpdateName}
                title={renderFieldTitle(!userProfile?.canUpdateName)}
                value={userProfile?.name}
                onSubmit={(editor) => {
                  handleSubmit(editor, "Berhasil menyimpan data nama lengkap");
                }}
                isSubmiting={isSubmiting}
                submitErrors={submitErrors}
                onConfirmSubmitErrors={resetSubmit}
                editor={{
                  title: "Ubah Nama Profil",
                  body: (
                    <div>
                      <p>
                        Anda hanya dapat mengubah nama profil 2 kali. Pastikan nama yang dimasukkan
                        sudah benar.
                      </p>
                      <p>
                        Mengubah data akan meminta Anda memasukkan ulang detail pribadi (Alamat,
                        KTP/KK beserta bukti).
                      </p>
                    </div>
                  ),
                }}
                field={{
                  description: (
                    <React.Fragment>
                      Nama akan digunakan sebagai nama peserta untuk keperluan data dan berkas cetak
                      (ID card, sertifikat, dsb)
                    </React.Fragment>
                  ),
                }}
              />
              <SubtleFieldNote>Sesuai KTP/KK</SubtleFieldNote>
            </div>

            <SplitInputs>
              <FieldDataEditor
                label="Tempat Lahir"
                placeholder="Isi tempat lahir"
                value={userProfile?.placeOfBirth}
                name="placeOfBirth"
                onSubmit={(editor) => {
                  handleSubmit(editor, "Berhasil menyimpan data tempat lahir");
                }}
                isSubmiting={isSubmiting}
                submitErrors={submitErrors}
                onConfirmSubmitErrors={resetSubmit}
                editor={{ title: "Ubah Tempat Lahir" }}
              />

              <FieldDataEditor
                label="Tanggal Lahir"
                placeholder="Isi tanggal lahir"
                name="date_of_birth"
                disabled={!userProfile?.canUpdateDateOfBirth}
                title={renderFieldTitle(!userProfile?.canUpdateDateOfBirth)}
                value={userProfile?.dateOfBirth}
                onSubmit={(editor) => {
                  handleSubmit(editor, "Berhasil menyimpan data tanggal lahir");
                }}
                isSubmiting={isSubmiting}
                submitErrors={submitErrors}
                onConfirmSubmitErrors={resetSubmit}
                editor={{
                  title: "Ubah Tanggal Lahir",
                  body: (
                    <div>
                      <p>
                        Anda hanya dapat mengubah tanggal lahir 2 kali. Pastikan tanggal lahir yang
                        sudah benar.
                      </p>
                      <p>
                        Mengubah data akan meminta Anda memasukkan ulang detail pribadi (Alamat,
                        KTP/KK beserta bukti).
                      </p>
                    </div>
                  ),
                }}
                field={{ type: "date" }}
              />

              <FieldDataEditor
                label="Jenis Kelamin"
                placeholder="Isi jenis kelamin"
                name="gender"
                disabled={!userProfile?.canUpdateGender}
                title={renderFieldTitle(!userProfile?.canUpdateGender)}
                value={userProfile?.gender}
                onSubmit={(editor) => {
                  handleSubmit(editor, "Berhasil menyimpan data jenis kelamin");
                }}
                isSubmiting={isSubmiting}
                submitErrors={submitErrors}
                onConfirmSubmitErrors={resetSubmit}
                editor={{
                  title: "Ubah Jenis Kelamin",
                  body: (
                    <div>
                      <p>
                        Anda hanya dapat mengubah tanggal lahir 2 kali. Pastikan tanggal lahir yang
                        sudah benar.
                      </p>
                      <p>
                        Mengubah data akan meminta Anda memasukkan ulang detail pribadi (Alamat,
                        KTP/KK beserta bukti).
                      </p>
                    </div>
                  ),
                }}
                field={{
                  type: "radio",
                  options: [
                    { value: "male", label: "Pria" },
                    { value: "female", label: "Wanita" },
                  ],
                }}
              />
            </SplitInputs>

            <FieldDataEditor
              label="No. Handphone"
              placeholder="Isi nomor handphone"
              name="phone_number"
              value={userProfile?.phoneNumber}
              onSubmit={(editor) => {
                handleSubmit(editor, "Berhasil menyimpan data nomor handphone");
              }}
              isSubmiting={isSubmiting}
              submitErrors={submitErrors}
              onConfirmSubmitErrors={resetSubmit}
              editor={{
                title: "Ubah No. Handphone",
                body: (
                  <div>
                    <p>
                      Nomor handphone digunakan sebagai kontak peserta. Pastikan data yang
                      dimasukkan sudah benar.
                    </p>
                  </div>
                ),
              }}
            />
          </InputGrid>
        </div>
      </ProfileFormLayout>
    </CardSheet>
  );
}

function CardDetailProfile() {
  const { userProfile, refresh: refreshProfile } = useUserProfile();
  const {
    data: verificationDetail,
    isLoading,
    fetchVerificationDetail,
  } = useVerificationDetail(userProfile?.id);
  const formVerification = useFormVerification(verificationDetail);
  const { submit, isLoading: isSubmiting } = useSubmitVerification(formVerification.data);

  const { province, city, nik, address, imageKTP } = formVerification.data;
  const {
    isDirty,
    errors: verificationErrors,
    updateField: updateVerification,
    updateNIK,
    updateImage,
    updateWithDependence,
  } = formVerification;

  const isVerificationDone = _checkIsVerificationDone(userProfile?.verifyStatus);

  if (!verificationDetail && isLoading) {
    return (
      <CardSheet>
        <SpinnerDotBlock />
      </CardSheet>
    );
  }

  return (
    <React.Fragment>
      <CardSheet>
        <CardTitle>Detail</CardTitle>

        <FieldInputText
          label="Alamat Lengkap"
          placeholder="Masukkan alamat sesuai KTP/KK"
          value={address}
          onChange={(value) => updateVerification("address", value)}
          disabled={isVerificationDone}
          errors={verificationErrors.address}
          required={!isVerificationDone}
        />

        <SplitInputs>
          <FieldSelectProvince
            value={province}
            onChange={(opt) => updateWithDependence("province", opt, "city")}
            disabled={isVerificationDone}
            errors={verificationErrors.province}
            required={!isVerificationDone}
          />

          <FieldSelectCity
            provinceId={province?.value}
            value={city}
            onChange={(opt) => updateVerification("city", opt)}
            disabled={isVerificationDone || !province?.value}
            errors={verificationErrors.city}
            required={!isVerificationDone}
          />
        </SplitInputs>

        <div>
          <FieldInputText
            label="NIK"
            placeholder="Masukkan 16 digit nomor KTP/KK"
            value={nik}
            onChange={updateNIK}
            disabled={isVerificationDone}
            errors={verificationErrors.nik}
            required={!isVerificationDone}
          />
          <SubtleFieldNote>
            Pengguna dibawah 17 tahun dapat memasukkan nomor NIK dari KK
          </SubtleFieldNote>
        </div>

        <div>
          <FieldUploadImage
            label="Foto KTP/KK"
            placeholder="Unggah gambar dengan file JPG/PNG"
            name="imageKTP"
            value={imageKTP}
            onChange={(value) => updateImage("imageKTP", value)}
            disabled={isVerificationDone}
            errors={verificationErrors.imageKTP}
            required={!isVerificationDone}
          />
          <SubtleFieldNote>Pengguna dibawah 17 tahun dapat melampirkan dokumen KK</SubtleFieldNote>
        </div>

        <ButtonList>
          {isVerificationDone ? (
            <ButtonBlue disabled>Simpan</ButtonBlue>
          ) : (
            <ButtonBlue
              disabled={!isDirty}
              onClick={() => {
                if (!isDirty) {
                  return;
                }
                submit({
                  onSuccess: () => {
                    toast.success("Data verifikasi berhasil disimpan");
                    fetchVerificationDetail();
                    refreshProfile();
                  },
                });
              }}
            >
              Simpan
            </ButtonBlue>
          )}
        </ButtonList>
      </CardSheet>

      <LoadingScreen loading={isSubmiting} />
    </React.Fragment>
  );
}

const CardSheet = styled.div`
  position: relative;
  margin-bottom: 24px;

  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);

  > * + * {
    margin-top: 1.5rem;
  }
`;

const CardTitle = styled.h5`
  font-weight: 600;
`;

const ProfileFormLayout = styled.div`
  display: flex;
  gap: 2rem;
  flex-direction: column;

  > *:nth-child(1) {
    width: 17.5rem;
    flex-shrink: 0;
    align-self: center;

    > * + * {
      margin-top: 1rem;
    }
  }

  @media (min-width: 600px) {
    flex-direction: row;
    gap: 4rem;

    > *:nth-child(1) {
      width: 11.25rem;
      flex-shrink: 0;
      align-self: flex-start;

      > * + * {
        margin-top: 1rem;
      }
    }

    > *:nth-child(2) {
      flex-grow: 1;

      display: flex;
      flex-direction: column;

      > * + * {
        margin-top: 1.5rem;
      }

      > *:nth-child(1) {
        flex-grow: 1;
      }

      > *:nth-child(2) {
        flex-shrink: 0;
      }
    }
  }
`;

const UploadInstruction = styled.p`
  margin: 0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--ma-gray-50);
  color: var(--ma-gray-500);
  font-size: 0.875em;
`;

const InputGrid = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const SplitInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 960px) {
    flex-direction: row;

    > * {
      flex-grow: 1;
    }
  }
`;

const SubtleFieldNote = styled.div`
  color: var(--ma-gray-400);
  font-size: 0.9em;
`;

const ButtonList = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

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

export default PageProfileHome;

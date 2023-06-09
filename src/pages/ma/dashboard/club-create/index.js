import React from "react";
import queryString from "query-string";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import { ArcheryClubService } from "services";

import MetaTags from "react-meta-tags";
import { Container, Row, Col, Modal, ModalBody } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { LoadingScreen } from "components";
import { ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { BreadcrumbDashboard } from "../components/breadcrumb";
import { FieldInputText, FieldSelect, FieldTextArea } from "./components";

import IconCamera from "components/ma/icons/mono/camera";
import IconAlertTriangle from "components/ma/icons/mono/alert-triangle";

const clubDataStructure = {
  logoImage: "",
  bannerImage: "",
  clubName: "",
  clubBasis: "",
  clubBasisAddress: "",
  clubBasisProvince: null,
  clubBasisCity: null,
  description: "",
};

function clubDataReducer(state, action) {
  return { ...state, ...action };
}

async function imageToBase64(imageFileRaw) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFileRaw);
    reader.onload = () => {
      const baseURL = reader.result;
      resolve(baseURL);
    };
  });
}

function PageClubCreate() {
  const { search } = useLocation();
  const { suggestedName } = queryString.parse(search);
  const [provinceOptions, setProvinceOptions] = React.useState([]);
  const [cityOptions, setCityOptions] = React.useState([]);

  const [clubData, updateClubData] = React.useReducer(clubDataReducer, {
    ...clubDataStructure,
    clubName: suggestedName,
  });
  const [fieldErrors, setFieldErrors] = React.useState(null);

  const [shouldShowConfirmCreate, setShowConfirmCreate] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState({
    status: "idle",
    errors: null,
  });

  const closeModalConfirmation = () => setShowConfirmCreate(false);
  const toggleModalConfirmation = () => setShowConfirmCreate((show) => !show);

  const isFetching = submitStatus.status === "fetching";
  const showAlertSuccess = submitStatus.status === "success";
  const showAlertErrors = submitStatus.status === "error" && Boolean(submitStatus.errors);
  const breadcrumpCurrentPageLabel = "Buat Klub";

  const handleConfirmError = () => {
    setSubmitStatus((state) => ({ ...state, status: "idle" }));
  };

  const computeClubBasisAddress = () => {
    const infos = [
      clubData.clubBasisAddress,
      clubData.clubBasisCity?.label,
      clubData.clubBasisProvince?.label,
    ];
    const byEmptyField = (info) => Boolean(info);
    return infos.filter(byEmptyField).join(", ");
  };

  const handleFieldChange = (field, value) => {
    updateClubData({ [field]: value });
    // Invalidate errors
    // Required field
    if (fieldErrors?.[field]?.length && value) {
      const updatedErrors = { ...fieldErrors };
      delete updatedErrors[field];
      setFieldErrors(updatedErrors);
    }
  };

  const handleChooseImage = (field, ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }
    const imageRawData = ev.target.files[0];
    const imagePreviewUrl = URL.createObjectURL(imageRawData);
    updateClubData({
      [field]: { preview: imagePreviewUrl, raw: imageRawData },
    });
  };

  const handleClickConfirmCreate = () => {
    const fieldsWithErrors = {};
    const requiredFields = [
      { name: "clubName", message: "Anda belum memasukkan nama klub" },
      { name: "clubBasis", message: "Nama tempat latihan belum terisi" },
      { name: "clubBasisAddress", message: "Alamat tempat latihan belum terisi" },
      { name: "clubBasisProvince", message: "Provinsi belum dipilih" },
      { name: "clubBasisCity", message: "Kota belum dipilih" },
    ];

    for (const field of requiredFields) {
      if (!clubData[field.name]) {
        fieldsWithErrors[field.name] = fieldsWithErrors[field.name]
          ? [...fieldsWithErrors[field], field.message]
          : [field.message];
      }
    }

    if (Object.keys(fieldsWithErrors).length) {
      setFieldErrors(fieldsWithErrors);
    } else {
      setShowConfirmCreate(true);
    }
  };

  const handleSubmitCreateClub = async () => {
    setSubmitStatus((state) => ({ ...state, status: "fetching" }));
    const bannerBase64 = clubData.bannerImage && (await imageToBase64(clubData.bannerImage.raw));
    const logoBase64 = clubData.logoImage && (await imageToBase64(clubData.logoImage.raw));

    const payload = {
      name: clubData.clubName.trim(),
      banner: bannerBase64,
      logo: logoBase64,
      place_name: clubData.clubBasis.trim(),
      province: clubData.clubBasisProvince.value,
      city: clubData.clubBasisCity.value,
      address: clubData.clubBasisAddress.trim(),
      description: clubData.description,
    };

    const createdClub = await ArcheryClubService.create(payload);

    if (createdClub?.success) {
      setShowConfirmCreate(false);
      setSubmitStatus((state) => ({ ...state, status: "success", errors: null }));
    } else if (createdClub?.errors) {
      const errorsFromServer = changeFieldName(createdClub.errors, "name", "clubName");
      setSubmitStatus((state) => ({ ...state, status: "error", errors: errorsFromServer }));
    }
  };

  React.useEffect(() => {
    const fetchProvinceOptions = async () => {
      const result = await ArcheryClubService.getProvinces({ limit: 50, page: 1 });
      if (result.success) {
        const provinceOptions = result.data.map((province) => ({
          label: province.name,
          value: parseInt(province.id),
        }));
        setProvinceOptions(provinceOptions);
      } else {
        console.log(result.errors || "error getting provinces list");
      }
    };

    fetchProvinceOptions();
  }, []);

  React.useEffect(() => {
    handleFieldChange("clubBasisCity", null);

    if (!clubData?.clubBasisProvince?.value) {
      setCityOptions([]);
      return;
    }

    const fetchCityOptions = async () => {
      const result = await ArcheryClubService.getCities({
        province_id: clubData.clubBasisProvince.value,
      });
      if (result.success) {
        const cityOptions = result.data.map((city) => ({
          label: city.name,
          value: parseInt(city.id),
        }));
        setCityOptions(cityOptions);
      } else {
        console.log(result.errors || "error getting cities list");
      }
    };

    fetchCityOptions();
  }, [clubData?.clubBasisProvince]);

  return (
    <ClubCreateWrapper>
      <MetaTags>
        <title>Buat Klub | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="/dashboard/clubs">
          {breadcrumpCurrentPageLabel}
        </BreadcrumbDashboard>

        <div className="card-club-form">
          <ClubImagesWrapper className="mb-4">
            {/* Banner image */}
            <div>
              <label
                htmlFor="field-image-bannerImage"
                className="club-image-top picker-input-control"
              >
                <input
                  className="picker-file-input"
                  id="field-image-bannerImage"
                  name="bannerImage"
                  type="file"
                  accept="image/jpg,image/jpeg,image/png"
                  onChange={(ev) => handleChooseImage("bannerImage", ev)}
                />
                {clubData.bannerImage?.preview ? (
                  <img className="club-banner-image" src={clubData.bannerImage.preview} />
                ) : (
                  <div className="picker-empty-placeholder">
                    <div className="picker-empty-placeholder-icon">
                      <IconCamera size="40" />
                    </div>
                    <div>Foto Banner</div>
                  </div>
                )}
              </label>
            </div>

            {/* Logo image */}
            <div className="club-image-bottom">
              <label htmlFor="field-image-logoImage" className="club-logo picker-input-control">
                <input
                  className="picker-file-input"
                  id="field-image-logoImage"
                  name="logoImage"
                  type="file"
                  accept="image/jpg,image/jpeg,image/png"
                  onChange={(ev) => handleChooseImage("logoImage", ev)}
                />
                {clubData.logoImage?.preview ? (
                  <img className="club-logo-image" src={clubData.logoImage.preview} />
                ) : (
                  <div className="picker-empty-placeholder">
                    <div className="picker-empty-placeholder-icon">
                      <IconCamera size="40" />
                    </div>
                    <div>Foto Profil</div>
                  </div>
                )}
              </label>
            </div>
          </ClubImagesWrapper>

          <FieldInputText
            name="clubName"
            placeholder="Masukkan nama tanpa kata &#34;Klub&#34;, contoh: &#34;Pro Archery&#34;"
            required
            errors={fieldErrors?.clubName}
            value={clubData.clubName}
            onChange={(value) => handleFieldChange("clubName", value)}
          >
            Nama Klub
          </FieldInputText>

          <FieldInputText
            name="clubBasis"
            placeholder="Masukkan tempat latihan klub. Contoh: GOR KEBON JERUK"
            required
            errors={fieldErrors?.clubBasis}
            value={clubData.clubBasis}
            onChange={(value) => handleFieldChange("clubBasis", value)}
          >
            Nama Tempat Latihan
          </FieldInputText>

          <FieldInputText
            name="clubBasisAddress"
            placeholder="Masukkan alamat tempat latihan klub. Contoh: Nama Jalan, Kecamatan, Kelurahan"
            required
            errors={fieldErrors?.clubBasisAddress}
            value={clubData.clubBasisAddress}
            onChange={(value) => handleFieldChange("clubBasisAddress", value)}
          >
            Alamat Tempat Latihan
          </FieldInputText>

          <Row>
            <Col>
              <FieldSelect
                name="clubBasisProvince"
                placeholder="Pilih provinsi &#47; wilayah"
                required
                errors={fieldErrors?.clubBasisProvince}
                options={provinceOptions}
                value={clubData.clubBasisProvince}
                onChange={(value) => handleFieldChange("clubBasisProvince", value)}
              >
                Provinsi&#47;Wilayah
              </FieldSelect>
            </Col>

            <Col>
              <FieldSelect
                name="clubBasisCity"
                placeholder={
                  clubData.clubBasisProvince ? "Pilih kota" : "Pilih provinsi terlebih dulu"
                }
                required
                errors={fieldErrors?.clubBasisCity}
                options={cityOptions}
                disabled={!clubData.clubBasisProvince}
                value={clubData.clubBasisCity}
                onChange={(value) => handleFieldChange("clubBasisCity", value)}
              >
                Kota
              </FieldSelect>
            </Col>
          </Row>

          <FieldTextArea
            name="description"
            placeholder="Ceritakan deskripsi singkat klub"
            value={clubData.description}
            onChange={(value) => handleFieldChange("description", value)}
          >
            Deskripsi Singkat &#40;Opsional&#41;
          </FieldTextArea>

          <div className="club-form-action">
            <ButtonBlue className="button-submit-create" onClick={handleClickConfirmCreate}>
              Buat Klub
            </ButtonBlue>
          </div>

          <Modal size="lg" isOpen={shouldShowConfirmCreate} toggle={toggleModalConfirmation}>
            <ModalBody>
              <ModalConfirmWrapper>
                <div className="modal-confirm-club-close">
                  <ButtonOutlineBlue
                    className="button-modal-close"
                    onClick={closeModalConfirmation}
                  >
                    &#10005;
                  </ButtonOutlineBlue>
                </div>
                <h4 className="text-center">Konfirmasi Data Klub</h4>
                <div className="text-center">Apakah data yang Anda isi sudah benar?</div>

                <ClubImagesWrapper className="my-4">
                  <div className="club-image-top preview">
                    {clubData.bannerImage?.preview && (
                      <img className="club-banner-image" src={clubData.bannerImage.preview} />
                    )}
                  </div>
                  <div className="club-image-bottom">
                    <div className="club-logo preview">
                      {clubData.logoImage?.preview && (
                        <img className="club-logo-image" src={clubData.logoImage.preview} />
                      )}
                    </div>
                  </div>
                </ClubImagesWrapper>

                <table width="100%">
                  <tbody>
                    <tr>
                      <td width="30%">Nama Klub</td>
                      <td width="2%">:</td>
                      <td>{clubData.clubName}</td>
                    </tr>
                    <tr>
                      <td>Nama Tempat Latihan</td>
                      <td>:</td>
                      <td>{clubData.clubBasis}</td>
                    </tr>
                    <tr>
                      <td>Alamat Tempat Latihan</td>
                      <td>:</td>
                      <td>{computeClubBasisAddress()}</td>
                    </tr>
                    <tr>
                      <td>Deskripsi Singkat</td>
                      <td>:</td>
                      <td>{clubData.description || <React.Fragment>&mdash;</React.Fragment>}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-5 d-flex justify-content-center">
                  <ButtonBlue className="button-submit" onClick={handleSubmitCreateClub}>
                    Buat Klub
                  </ButtonBlue>
                </div>
              </ModalConfirmWrapper>

              <LoadingScreen loading={isFetching} />
            </ModalBody>
          </Modal>

          <AlertSuccess show={showAlertSuccess} />
          <AlertErrors
            show={showAlertErrors}
            onConfirm={handleConfirmError}
            errors={submitStatus.errors}
          />
        </div>
      </Container>
    </ClubCreateWrapper>
  );
}

function AlertSuccess({ show }) {
  return (
    <SweetAlert
      show={show}
      title=""
      custom
      btnSize="md"
      style={{ padding: "30px 40px" }}
      onConfirm={() => {}}
      customButtons={
        <div className="d-flex flex-column w-100">
          <ButtonBlue as={Link} to="/dashboard/clubs">
            Kembali ke Klub Saya
          </ButtonBlue>
        </div>
      }
    >
      <h4>Berhasil</h4>
      <p>Klub Anda telah berhasil dibuat</p>
    </SweetAlert>
  );
}

function AlertErrors({ show, onConfirm, errors }) {
  const renderErrorMessages = () => {
    if (errors) {
      const fields = Object.keys(errors);
      const messages = fields.map((field) => {
        return `${errors[field].map((message) => `- ${message}\n`).join("")}`;
      });
      return `${messages.join("")}`;
    }
    return "Error tidak diketahui.";
  };

  return (
    <SweetAlert
      show={show}
      title=""
      custom
      btnSize="md"
      style={{ padding: "30px 40px", width: "720px" }}
      onConfirm={() => onConfirm?.()}
      customButtons={
        <span className="d-flex flex-column w-100">
          <ButtonBlue onClick={onConfirm}>Tutup</ButtonBlue>
        </span>
      }
    >
      <h4>
        <IconAlertTriangle />
      </h4>
      <div className="text-start">
        <p>
          Terdapat error teknis dalam memproses data klub Anda. Silakan berikan pesan error berikut
          kepada technical support:
        </p>
        <pre className="p-3" style={{ backgroundColor: "var(--ma-gray-100)" }}>
          {renderErrorMessages()}
        </pre>
      </div>
    </SweetAlert>
  );
}

const ClubCreateWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .card-club-form {
    position: relative;

    padding: 2rem;
    border-radius: 4px;
    border: 0px solid rgb(246, 246, 246);
    box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
    background-color: #ffffff;
    background-clip: border-box;

    .club-form-action {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;

      .button-submit-create {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }
  }
`;

const ClubImagesWrapper = styled.div`
  .picker-input-control {
    position: relative;
    margin: 0;

    .picker-file-input {
      visibility: hidden;
      position: absolute;
      top: 0;
      left: -2000px;
    }

    .picker-empty-placeholder {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ma-gray-400);

      &-icon {
        margin-bottom: 0.75rem;
        color: #ffffff;
      }
    }
  }

  .club-image-top {
    position: relative;
    width: 100%;
    padding-bottom: 42%;
    background-color: var(--ma-gray-200);
    overflow: hidden;

    &.preview {
      background-color: var(--ma-blue);
    }

    .club-banner-image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .club-image-bottom {
    position: relative;
    width: 100%;
    min-height: 90px;
  }

  .club-logo {
    position: absolute;
    top: -90px;
    left: 20px;

    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
    border: solid 5px #efefef;
    background-color: var(--ma-gray-200);

    &-image {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
`;

const ModalConfirmWrapper = styled.div`
  position: relative;
  margin: -1rem;
  padding: 2rem;
  font-family: "Inter";

  .modal-confirm-club-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;

    .button-modal-close {
      border-radius: 2rem;
      border-width: 1.75px;
      font-weight: 600;
      transform: scale(0.7);
    }
  }

  .button-submit {
    min-width: 120px;
  }
`;

function changeFieldName(obj, originalName, newName) {
  const tranformedObj = obj;
  tranformedObj[newName] = tranformedObj[originalName];
  delete tranformedObj[originalName];
  return tranformedObj;
}

export default PageClubCreate;

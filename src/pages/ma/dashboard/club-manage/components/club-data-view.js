import React from "react";
import styled from "styled-components";
import { ArcheryClubService } from "services";

import { Row, Col } from "reactstrap";
import { ButtonBlue } from "components/ma";
import { FieldInputText, FieldSelect, FieldTextArea } from "../../club-create/components";

import IconCamera from "components/ma/icons/mono/camera";

function ClubProfileDataView({ club, updateClubData, errors, onSave }) {
  const [provinceOptions, setProvinceOptions] = React.useState(null);
  const [cityOptions, setCityOptions] = React.useState(null);

  const handleFieldChange = (field, value) => {
    if (field === "province") {
      // reset field city ketika province berubah
      updateClubData({ province: value, city: null });
    } else {
      updateClubData({ [field]: value });
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

  const handleSaveEdits = () => {
    onSave?.();
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
    if (!club?.province?.value) {
      return;
    }

    const fetchCityOptions = async () => {
      const result = await ArcheryClubService.getCities({ province_id: club.province.value });
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
  }, [club.province]);

  return (
    <DataViewContainer>
      <ClubImagesWrapper className="mb-4">
        {/* Banner image */}
        <div>
          <label htmlFor="field-image-bannerImage" className="club-image-top picker-input-control">
            <input
              className="picker-file-input"
              id="field-image-bannerImage"
              name="bannerImage"
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              onChange={(ev) => handleChooseImage("bannerImage", ev)}
            />
            {club?.bannerImage?.preview || club?.banner ? (
              <img className="club-banner-image" src={club?.bannerImage?.preview || club?.banner} />
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
            {club?.logoImage?.preview || club?.logo ? (
              <img className="club-logo-image" src={club?.logoImage?.preview || club?.logo} />
            ) : (
              <div className="picker-empty-placeholder">
                <div className="picker-empty-placeholder-icon mb-2">
                  <IconCamera size="32" />
                </div>
                <div>Foto Profil</div>
              </div>
            )}
          </label>
        </div>
      </ClubImagesWrapper>

      <FieldInputText
        name="name"
        placeholder="Masukkan nama tanpa kata &#34;Klub&#34;, contoh: &#34;Pro Archery&#34;"
        required
        value={club?.name || ""}
        onChange={(value) => handleFieldChange("name", value)}
        errors={errors?.name}
      >
        Nama Klub
      </FieldInputText>

      <FieldInputText
        name="placeName"
        placeholder="Masukkan tempat latihan klub. Contoh: GOR KEBON JERUK"
        required
        value={club?.placeName || ""}
        onChange={(value) => handleFieldChange("placeName", value)}
        errors={errors?.placeName}
      >
        Nama Tempat Latihan
      </FieldInputText>

      <FieldInputText
        name="address"
        placeholder="Masukkan alamat tempat latihan klub. Contoh: Nama Jalan, Kecamatan, Kelurahan"
        required
        value={club?.address || ""}
        onChange={(value) => handleFieldChange("address", value)}
        errors={errors?.address}
      >
        Alamat Tempat Latihan
      </FieldInputText>

      <Row>
        <Col>
          <FieldSelect
            name="province"
            placeholder="Pilih provinsi &#47; wilayah"
            required
            options={provinceOptions}
            value={club?.province || null}
            onChange={(value) => handleFieldChange("province", value)}
            errors={errors?.province}
          >
            Provinsi&#47;Wilayah
          </FieldSelect>
        </Col>

        <Col>
          <FieldSelect
            name="city"
            placeholder="Pilih kota"
            required
            options={cityOptions}
            value={club?.city || null}
            onChange={(value) => handleFieldChange("city", value)}
            errors={errors?.city}
          >
            Kota
          </FieldSelect>
        </Col>
      </Row>

      <FieldTextArea
        name="description"
        placeholder="Ceritakan deskripsi singkat klub"
        value={club?.description || ""}
        onChange={(value) => handleFieldChange("description", value)}
      >
        Deskripsi Singkat &#40;Opsional&#41;
      </FieldTextArea>

      <div className="club-form-action">
        <ButtonBlue className="button-submit-save" onClick={handleSaveEdits}>
          Simpan
        </ButtonBlue>
      </div>
    </DataViewContainer>
  );
}

const DataViewContainer = styled.div`
  padding: 2rem;

  .club-form-action {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;

    .button-submit-save {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }
`;

const ClubImagesWrapper = styled.div`
  .picker-input-control {
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
    padding-bottom: 25%;
    background-color: var(--ma-gray-200);
    overflow: hidden;

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
    min-height: 55px;
  }

  .club-logo {
    position: absolute;
    top: -55px;
    left: 20px;

    width: 110px;
    height: 110px;
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

export { ClubProfileDataView };

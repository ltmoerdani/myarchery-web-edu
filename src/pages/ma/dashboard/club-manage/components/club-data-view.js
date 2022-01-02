import React from "react";
import styled from "styled-components";

import { Row, Col } from "reactstrap";
import { ButtonBlue } from "components/ma";
import { FieldInputText, FieldSelect, FieldTextArea } from "../../club-create/components";

function ClubProfileDataView({ club }) {
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
            {club?.banner && (
              <img className="club-banner-image" src={club?.bannerImage?.preview || club?.banner} />
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
            {club?.logo && (
              <img className="club-logo-image" src={club?.logoImage?.preview || club?.logo} />
            )}
          </label>
        </div>
      </ClubImagesWrapper>

      <FieldInputText
        name="clubName"
        placeholder="Masukkan nama tanpa kata &#34;Klub&#34;, contoh: &#34;Pro Archery&#34;"
        required
        value={club?.name || ""}
        onChange={(value) => handleFieldChange("clubName", value)}
      >
        Nama Klub
      </FieldInputText>

      <FieldInputText
        name="clubName"
        placeholder="Masukkan tempat latihan klub. Contoh: GOR KEBON JERUK"
        required
        value={club?.placeName || ""}
        onChange={(value) => handleFieldChange("placeName", value)}
      >
        Nama Tempat Latihan
      </FieldInputText>

      <FieldInputText
        name="address"
        placeholder="Masukkan alamat tempat latihan klub. Contoh: Nama Jalan, Kecamatan, Kelurahan"
        required
        value={club?.address || ""}
        onChange={(value) => handleFieldChange("address", value)}
      >
        Alamat Tempat Latihan
      </FieldInputText>

      <Row>
        <Col>
          <FieldSelect
            name="province"
            placeholder="Pilih provinsi &#47; wilayah"
            required
            options={[{ label: "Jawa Tengah", value: 33 }]}
            value={club?.province || null}
            onChange={(value) => handleFieldChange("province", value)}
          >
            Provinsi&#47;Wilayah
          </FieldSelect>
        </Col>

        <Col>
          <FieldSelect
            name="city"
            placeholder="Pilih kota"
            required
            options={[{ label: "Kota Semarang", value: 74 }]}
            value={club?.city || null}
            onChange={(value) => handleFieldChange("city", value)}
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
        <ButtonBlue className="button-submit-create" onClick={() => {}}>
          Buat Klub
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

    .button-submit-create {
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
  }

  .club-image-top {
    position: relative;
    width: 100%;
    padding-bottom: 25%;
    background-color: var(--ma-blue);
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
    background-color: var(--ma-gray-400);

    &-image {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
`;

export { ClubProfileDataView };

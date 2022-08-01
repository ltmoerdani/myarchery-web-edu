import * as React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import { Input, Label } from "reactstrap";
import { FieldInputText, FieldSelectCategory, FieldSelectClub } from "../components";
import { Show } from "../components/show-when";
import { FieldErrorMessage } from "../components/field-error-message";
import { PickerMatchDate } from "../components/picker-match-date";

import IconAddress from "components/ma/icons/mono/address";

import { checkIsIndividu } from "../utils";

function FormView({ userProfile, eventCategories, formOrder }) {
  const { search } = useLocation();
  const {
    data: formData,
    errors: formErrors,
    updateField,
    setCategory,
    setWithClub,
    setClub,
  } = formOrder;
  const { category, matchDate, withClub, club } = formData;

  const qs_category_id = new URLSearchParams(search).get("categoryId");
  const categoryId = qs_category_id ? parseInt(qs_category_id) : qs_category_id;
  const isCategoryIndividu = checkIsIndividu(category);

  // Kategori default ketika dikirim id lewat param URL
  React.useEffect(() => {
    if (!eventCategories) {
      return;
    }

    let category;
    for (const group in eventCategories) {
      const targetCategory = eventCategories[group].find(
        (category) => parseInt(category.id) === categoryId
      );
      if (targetCategory) {
        category = targetCategory;
        break;
      }
    }

    category && updateField({ category });
  }, [eventCategories]);

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

      <SegmentByTeamCategory
        teamFilters={["individu male", "individu female"]}
        teamCategoryId={category?.teamCategoryId}
      >
        <div className="mt-5 mb-0">
          <h5>Data Peserta</h5>
          {/* <p>Masukkan email peserta yang telah terdaftar</p> */}
        </div>
      </SegmentByTeamCategory>

      <div style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
        <div>
          <Label className="form-check-label" style={{ marginBottom: "0.25rem" }}>
            Apakah Anda mewakili klub?
          </Label>
        </div>

        <div>
          <div
            className={`form-check form-radio-primary`}
            style={{ display: "inline-block", marginRight: 10 }}
          >
            <Input
              type="radio"
              name="withClub"
              id="with-club-yes"
              value="yes"
              onChange={() => {
                setWithClub("yes");
              }}
              checked={withClub === "yes" ? true : false}
              className="form-check-Input"
              disabled={!category}
            />
            <Label className="form-check-label" htmlFor="with-club-yes">
              Iya, saya mewakili klub
            </Label>
          </div>

          <div
            className={`form-check form-radio-primary`}
            style={{ display: "inline-block", marginRight: 10 }}
          >
            <Input
              type="radio"
              name="withClub"
              id="with-club-no"
              value="no"
              onChange={() => {
                setWithClub("no");
              }}
              checked={withClub === "no" ? true : false}
              className="form-check-Input"
              disabled={!category}
            />
            <Label className="form-check-label" htmlFor="with-club-no">
              Tidak, saya individu
            </Label>
          </div>

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

export { FormView };

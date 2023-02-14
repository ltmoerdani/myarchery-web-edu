import React from "react";
import { Label } from "reactstrap";
import styled from "styled-components";
import { checkIsIndividu } from "../utils";
import { FieldErrorMessage } from "./field-error-message";
import { FieldSelectClub } from "./field-select-club";
import { FieldSelectKontingen } from "./field-select-kontingen";
import { SelectRadio } from "./select-radio";
import { Show } from "./show-when";

const DetailsClubContigent = ({
  formOrder,
  eventDetailData,
  withContingen,
}) => {
  const { errors: orderErrors, setWithClub, setClub, setCityId } = formOrder;
  const { category, withClub, club, city_id, registrationType } =
    formOrder.data;
  const isCategoryIndividu = checkIsIndividu(category);
  return (
    <div>
      {withContingen ? (
        <div>
          <FieldSelectKontingen
            provinceId={parseInt(
              eventDetailData?.publicInformation?.eventCity?.provinceId
            )}
            required
            value={city_id}
            onChange={setCityId}
          />
          <FieldErrorMessage errors={orderErrors.city_id} />
        </div>
      ) : (
        <div>
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

          <FieldSelectClub
            required={!category && !isCategoryIndividu}
            disabled={!category || withClub == "no"}
            value={club}
            onChange={setClub}
            errors={orderErrors.club}
          >
            {registrationType
              ? "Klub (Kontingen/Tim/Kelompok, dst)?"
              : "Pilih Klub yang diwakilkan"}
          </FieldSelectClub>

          <Show when={isCategoryIndividu}>
            <SubtleFieldNote>
              Dapat dikosongkan jika tidak mewakili klub
            </SubtleFieldNote>
          </Show>
        </div>
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

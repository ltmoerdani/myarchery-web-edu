import IconAlertCircle from "components/ma/icons/color/alert-circle";
import IconCheckVerify from "components/ma/icons/color/check-verify";
import React from "react";
import styled from "styled-components";
import { stringUtil } from "utils";
import {
  checkVerification,
  useQuotaVerification,
} from "../../hooks/check-verification";
import {
  HeaderTitleText,
  PopupWarning,
  TableCellText,
  TableListParticipant,
} from "./single-list-participant";
import { Button, ButtonBlue } from "components/ma";

const TeamListParticipant = ({ formOrder, wizardView, eventDetailData }) => {
  const { goToPreviousStep, goToNextStep } = wizardView;
  const { listParticipants, category } = formOrder.data;
  const headTable = [
    "No",
    "Email",
    "Nama",
    "Gender",
    "Tanggal Lahir",
    "Kewarganegaraan",
    "Provinsi",
    "Kota",
    "Memenuhi Syarat",
  ];
  const [userVerification, setUserVerification] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState([]);
  const [quotaMale, quotaFemale] = useQuotaVerification(
    category,
    listParticipants
  );
  React.useEffect(() => {
    const checkUserVerification = checkVerification(
      listParticipants,
      category,
      eventDetailData
    );
    setUserVerification(checkUserVerification);
  }, [listParticipants, category]);
  const shouldDisabledButton = quotaFemale === 0 || quotaMale === 0;
  return (
    <div>
      <HeaderTitleText>Peserta yang bisa ikut kategori beregu</HeaderTitleText>
      <TableListParticipant className="list-table-participant">
        <thead>
          <tr>
            {headTable.map((e) => (
              <th key={stringUtil.createRandom()}>{e}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {listParticipants?.length &&
            listParticipants?.map((e, i) => (
              <tr key={e.email}>
                <td>{i + 1}</td>
                <td>
                  <TableCellText>{e.email}</TableCellText>
                </td>
                <td>
                  <TableCellText className="name-field">{e.name}</TableCellText>
                </td>
                <td>
                  <div
                    style={{
                      width: "60px",
                      paddingLeft: 2,
                      textTransform: "capitalize",
                    }}
                  >
                    {e.gender}
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "60px",
                      paddingLeft: 2,
                      textTransform: "capitalize",
                    }}
                  >
                    {Math.floor(
                      (new Date() - new Date(e.dateOfBirth).getTime()) /
                        3.15576e10
                    )}{" "}
                    Tahun
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "80px",
                      paddingLeft: 2,
                      textTransform: "capitalize",
                    }}
                  >
                    {e.country?.name}
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "80px",
                      paddingLeft: 2,
                      textTransform: "capitalize",
                    }}
                  >
                    {e.province?.name ?? "-"}
                  </div>
                </td>
                <td>
                  <div style={{ width: "134px" }}>{e.city?.name ?? "-"}</div>
                </td>
                <td>
                  {userVerification && (
                    <VerifyWrapper>
                      <VerifyBox>
                        {userVerification[i]?.ageIsValid &&
                        userVerification[i]?.genderIsValid &&
                        userVerification[i]?.quoteIsValid ? (
                          <IconCheckVerify />
                        ) : (
                          <div
                            onClick={() => {
                              if (i === 0) {
                                setShowPopup((value) => [
                                  { id: i, show: !value[i]?.show },
                                ]);
                              }
                            }}
                          >
                            <IconAlertCircle />
                          </div>
                        )}
                      </VerifyBox>
                      {userVerification[i]?.userEmail === e.email ||
                      showPopup[i]?.id === i ? (
                        <PopupWarning
                          showPopup={
                            showPopup[i]?.id === i ? showPopup[i]?.show : null
                          }
                        >
                          {!userVerification[i]?.ageIsValid
                            ? "umur tidak sesuai"
                            : !userVerification[i]?.genderIsValid
                            ? "gender tidak sesuai"
                            : !userVerification[i]?.quoteIsValid
                            ? "kuota tidak tersedia"
                            : ""}
                        </PopupWarning>
                      ) : null}
                    </VerifyWrapper>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </TableListParticipant>
      <ButtonSectionWrapper>
        <Button
          style={{
            backgroundColor: "transparent",
            border: "1px solid #0D47A1",
            padding: "8px 16px",
            borderRadius: "8px",
            color: "#0D47A1",
            fontWeight: 600,
            fontSize: "14px",
          }}
          onClick={() => goToPreviousStep()}
        >
          Kembali
        </Button>
        <ButtonBlue
          disabled={shouldDisabledButton}
          onClick={() => goToNextStep()}
        >
          Selanjutnya
        </ButtonBlue>
      </ButtonSectionWrapper>
    </div>
  );
};

const VerifyBox = styled.div`
  width: 1.125rem;
  height: 1.125rem;
  position: relative;
`;

const VerifyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  position: relative;
`;

const ButtonSectionWrapper = styled.span`
  margin-bottom: 2.875rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
`;

export default TeamListParticipant;

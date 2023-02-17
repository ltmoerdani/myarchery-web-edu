import IconAlertCircle from "components/ma/icons/color/alert-circle";
import IconCheckVerify from "components/ma/icons/color/check-verify";
import React from "react";
import { ArcherService } from "services";
import styled from "styled-components";
import { stringUtil } from "utils";
import checkVerification from "../../hooks/check-verification";
import {
  HeaderTitleText,
  PopupWarning,
  TableCellText,
  TableListParticipant,
} from "./single-list-participant";

const MultiParticipantTable = ({
  listUserEmail = {},
  userVerification = [],
}) => {
  const [showPopup, setShowPopup] = React.useState([]);
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

  return (
    <TableListParticipant className="list-table-participant">
      <thead>
        <tr>
          {headTable.map((e) => (
            <th key={stringUtil.createRandom()}>{e}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {listUserEmail?.registeredEmail?.length &&
          listUserEmail?.registeredEmail?.map((e, i) => (
            <tr key={e.email}>
              <td>{i + 1}</td>
              <td>
                <TableCellText>{e.email}</TableCellText>
              </td>
              <td>
                <TableCellText className="name-field">{e.name}</TableCellText>
              </td>
              <td>
                <div style={{ width: "94px" }}>{e.gender}</div>
              </td>
              <td>
                <div style={{ width: "150px" }}>
                  {Math.floor(
                    (new Date() - new Date(e.dateOfBirth).getTime()) /
                      3.15576e10
                  )}{" "}
                  Tahun
                </div>
              </td>
              <td>
                <div style={{ width: "144px" }}>{e.country?.name}</div>
              </td>
              <td>
                <div style={{ width: "134px" }}>{e.province?.name ?? "-"}</div>
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
  );
};

const MultiListParticipant = ({
  formOrder,
  wizardView,
  eventDetailData,
  userProfile,
}) => {
  console.log(wizardView);
  const { multiParticipants, asParticipant, isCollective, category } =
    formOrder.data;
  const [listUserEmail, setListUserEmail] = React.useState(null);
  const [userRegisteredVerification, setUserRegisteredVerification] =
    React.useState(null);
  const checkMultipleEmail = async (data = []) => {
    const emailParticipants = data?.map((e) => e.value);
    const result = await ArcherService.checkEmailRegistered({
      emails: emailParticipants,
    });
    const groupEmailRegistered = [];
    const groupEmailNotRegistered = [];
    if (result?.data) {
      result?.data?.map((e) => {
        if (e.data) {
          groupEmailRegistered.push(e.data);
        } else {
          const emailNotRegistedData = {};
          emailNotRegistedData.email = e.message?.split(" ")[1];
          groupEmailNotRegistered.push(emailNotRegistedData);
        }
      });
    }
    if (asParticipant === true && isCollective === true) {
      const currentUser = await ArcherService.checkEmailRegistered({
        emails: [userProfile?.email],
      });
      groupEmailRegistered.unshift(currentUser?.data[0]?.data);
    }
    const combineGroupEmail = {
      notRegisteredEmail: groupEmailNotRegistered,
      registeredEmail: groupEmailRegistered,
    };
    setListUserEmail(combineGroupEmail);
  };

  React.useEffect(() => {
    checkMultipleEmail(multiParticipants);
    const checkUserRegisteredVerification = checkVerification(
      listUserEmail?.registeredEmail,
      category,
      eventDetailData
    );
    setUserRegisteredVerification(checkUserRegisteredVerification);
  }, [multiParticipants, category]);
  // console.log(category);
  return (
    <>
      <div>
        <HeaderTitleText>Email Sudah Terdaftar</HeaderTitleText>
        <MultiParticipantTable
          listUserEmail={listUserEmail}
          userVerification={userRegisteredVerification}
        />
      </div>
      <div>
        <HeaderTitleText>Email Belum Terdaftar</HeaderTitleText>
      </div>
    </>
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

export default MultiListParticipant;

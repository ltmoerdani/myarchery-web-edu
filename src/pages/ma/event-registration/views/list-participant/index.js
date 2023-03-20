import React from "react";
import { Button, ButtonBlue } from "components/ma";
import { Modal, ModalBody } from "reactstrap";
import AsyncCreatableSelect from "react-select/async-creatable";
import styled from "styled-components";
import MultiListParticipant from "./multi-list-participant";
import SingleListParticipant from "./single-list-participant";
import TeamListParticipant from "./team-list-participant";
import { ArcherService } from "services";
import { stringUtil } from "utils";

const ListParticipant = ({
  formOrder,
  wizardView,
  eventDetailData,
  userProfile,
}) => {
  const { setMultiParticipants } = formOrder;
  const { selectCategoriesType, isCollective, multiParticipants, category } =
    formOrder.data;
  const [loadingOption, setLoadingOption] = React.useState(false);
  const [checkInputLength, setCheckInputLength] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [quota, setQuota] = React.useState(null);
  const [quotaMale, setQuotaMale] = React.useState(
    category?.maleQuota - category?.maleParticipant
  );
  const [quotaFemale, setQuotaFemale] = React.useState(
    category?.femaleQuota - category?.femaleParticipant
  );
  const [optionsUser, setOptionsUser] = React.useState([]);
  React.useEffect(() => {
    let countQuotaMale = category?.maleQuota - category?.maleParticipant;
    let countQuotaFemale = category?.femaleQuota - category?.femaleParticipant;
    if (optionsUser?.length) {
      optionsUser.map((e) => {
        if (e.gender === "male") {
          countQuotaMale -= 1;
        } else if (e.gender === "female") {
          countQuotaFemale -= 1;
        }
      });
      setQuotaFemale(countQuotaFemale);
      setQuotaMale(countQuotaMale);
      if (!checkInputLength.length) {
        setLoadingOption(false);
      }
    } else {
      setQuotaFemale(countQuotaFemale);
      setQuotaMale(countQuotaMale);
      if (!checkInputLength.length) {
        setLoadingOption(false);
      }
    }
    setQuota(
      multiParticipants.length + (optionsUser ? optionsUser?.length : 0)
    );
  }, [optionsUser, checkInputLength]);
  const handleAddNewParticipant = () => {
    if (optionsUser?.length) {
      const newDataUser = optionsUser?.map((e) => {
        return {
          id: stringUtil.createRandom(),
          email: e.email || e.value,
          ...e,
        };
      });
      const checkUserHasBeenAdded = multiParticipants?.filter(
        (e) => newDataUser && newDataUser?.find((el) => el.email === e.email)
      );
      if (!checkUserHasBeenAdded?.length) {
        const mergeData = [...multiParticipants, ...newDataUser];
        setMultiParticipants(mergeData);
      } else {
        const mergeData = [...multiParticipants];
        setMultiParticipants(mergeData);
      }
      setShowModal(false);
    } else {
      setShowModal(false);
    }
    setOptionsUser([]);
  };
  const findOptionsUser = async (input = "", callback) => {
    setLoadingOption(true);
    const res = await ArcherService.checkEmailRegistered({
      emails: [input],
    });
    const result = [];
    if (res?.data?.length) {
      let { data } = res;
      if (data[0].data) {
        data.map((e) => {
          result.push({
            ...e.data,
            value: e.data?.email,
            label: e.data?.email,
            email: e.data?.email,
          });
        });
        callback(result);
      } else {
        callback(result);
        setLoadingOption(false);
      }
    } else {
      callback(result);
    }
  };
  return (
    <>
      {selectCategoriesType !== "individual" ||
      (selectCategoriesType === "individual" && isCollective) ? (
        <HeaderBox>
          <HeaderWrapper>
            <HeaderTitleText>Data Peserta</HeaderTitleText>
            <HeaderSubtitleText>
              Silakan periksa kembali kelengkapan data peserta dan lengkapi data
              peserta yang belum memiliki email
            </HeaderSubtitleText>
          </HeaderWrapper>
          {selectCategoriesType === "individual" && isCollective ? (
            <ButtonWrapper>
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
                // disabled={quotaMale === 0 || quotaFemale === 0 || multiParticipants.length === 20}
                disabled={false}
                onClick={() => setShowModal(true)}
              >
                Tambah Peserta{" "}
                <span style={{ fontSize: "16px", paddingLeft: "10px" }}>+</span>
              </Button>
            </ButtonWrapper>
          ) : null}
        </HeaderBox>
      ) : null}
      <ContentCard>
        {selectCategoriesType === "individual" && isCollective === false ? (
          <SingleListParticipant
            formOrder={formOrder}
            wizardView={wizardView}
            eventDetailData={eventDetailData}
            userProfile={userProfile}
          />
        ) : selectCategoriesType === "team" ||
          selectCategoriesType === "mix" ? (
          <TeamListParticipant
            formOrder={formOrder}
            wizardView={wizardView}
            eventDetailData={eventDetailData}
          />
        ) : selectCategoriesType === "individual" && isCollective === true ? (
          <MultiListParticipant
            formOrder={formOrder}
            wizardView={wizardView}
            eventDetailData={eventDetailData}
            userProfile={userProfile}
          />
        ) : null}
      </ContentCard>
      <StyledBSModal
        size="xl"
        isOpen={showModal}
        onClosed={() => setShowModal(false)}
        centered
      >
        <StyledBSModalBody>
          <ModalHeaderWrapper>
            <ModalTitle>Data Peserta</ModalTitle>
            <ModalSubTitle>Email Peserta yang Didaftarkan</ModalSubTitle>
            <ModalDescText>
              Anda bisa memasukkan peserta yang belum memiliki akun MyArchery.
              Siapkan data peserta (Nama, Gender, Usia, Kewarganegaraan, Kota
              Asal) untuk diinput pada tahap selanjutnya.
            </ModalDescText>
          </ModalHeaderWrapper>
          <AsyncCreatableSelect
            cacheOptions
            isMulti
            value={optionsUser}
            isLoading={loadingOption}
            isSearchable={quotaMale === 0 && quotaFemale === 0 ? false : true}
            onChange={(val) => setOptionsUser(val)}
            onInputChange={(newValue) => setCheckInputLength(newValue)}
            loadOptions={findOptionsUser}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              paddingTop: "15px",
            }}
          >
            <QuoteText>Kuota Tersisa: {20 - quota}</QuoteText>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "20px",
              padding: "20px 0",
            }}
          >
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
              onClick={() => setShowModal(false)}
            >
              Batal
            </Button>
            <ButtonBlue
              disabled={20 - quota === 0}
              onClick={handleAddNewParticipant}
            >
              Simpan
            </ButtonBlue>
          </div>
        </StyledBSModalBody>
      </StyledBSModal>
    </>
  );
};

const StyledBSModal = styled(Modal)`
  .modal-content {
    border-radius: 1.25rem;
  }
`;

const StyledBSModalBody = styled(ModalBody)`
  font-family: "Inter", sans-serif;
  margin: auto auto;
`;

const ModalHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalTitle = styled.span`
  font-weight: 600;
  font-size: 20px;
  color: #1c1c1c;
`;

const ModalSubTitle = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #1c1c1c;
  margin-top: 20px;
  margin-bottm: 4px;
`;

const ModalDescText = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #757575;
`;

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  @media (max-width: 920px) {
    align-items: start;
    flex-direction: column;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  @media (max-width: 920px) {
    padding-bottom: 20px;
  }
`;

const ContentCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  padding-bottom: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0 1.75rem 0;
`;

const HeaderTitleText = styled.h1`
  color: #545454;
  font-weight: 600;
  font-size: 20px;
`;

const HeaderSubtitleText = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #545454;
`;

const QuoteText = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #757575;
`;

export default ListParticipant;

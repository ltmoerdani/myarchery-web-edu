import * as React from "react";
import styled from "styled-components";
import IconAddress from "components/ma/icons/mono/address";
import { Button, ButtonBlue } from "components/ma";
import { Modal, ModalBody } from "reactstrap";
import { PickerMatchDate } from "../components/picker-match-date";
import CategorySelect from "../components/card-category-select";
import DetailsRegistrant from "../components/card-details-registrant";
import DetailsParticipant from "../components/card-details-participant";
import DetailsClubContigent from "../components/card-details-club-contigent";
import { OrderEventService } from "services";

const ClassificationType = (props) => {
  const { parentClassificationId, formOrder, eventDetailData } = props;
  return (
    <ContentCardLayout
      title={
        parentClassificationId === 2 ||
        parentClassificationId === 3 ||
        parentClassificationId === 4
          ? "Detail Kontingen"
          : parentClassificationId === 1
          ? "Detail Klub"
          : parentClassificationId > 5
          ? "Detail Klasifikasi"
          : ""
      }
    >
      <DetailsClubContigent
        formOrder={formOrder}
        eventDetailData={eventDetailData}
        parentClassificationId={parentClassificationId}
      />
    </ContentCardLayout>
  );
};

const ContentCardLayout = ({
  withHeaderTitle,
  headerTitle,
  title,
  children,
}) => {
  return (
    <ContentCard>
      {withHeaderTitle ? (
        <HeaderTitleText>{headerTitle}</HeaderTitleText>
      ) : null}
      <MainCardHeader>
        <WrappedIcon>
          <IconAddress />
        </WrappedIcon>
        <MainCardHeaderText>{title}</MainCardHeaderText>
      </MainCardHeader>
      {children}
    </ContentCard>
  );
};

function FormView({
  userProfile,
  eventCategories,
  formOrder,
  onProfileUpdated,
  eventDetailData,
  parentClassificationId,
  pageTitle,
  wizardView,
}) {
  const {
    errors: orderErrors,
    updateField,
    setRegistrationType,
    setIsColective,
    setCategory,
    setSelectCategoryTab,
    setSelectCategoriesType,
    setSelectClassCategories,
    setListParticipants,
    setEmailNotRegisteredList,
    setEmailRegisteredList,
    setMultiParticipants,
  } = formOrder;
  const { goToNextStep } = wizardView;
  const {
    category,
    matchDate,
    selectCategoryTab,
    selectCategoriesType,
    selectClassCategories,
    city_id,
    countryData,
    provinceData,
    listParticipants,
    asParticipant,
    isCollective,
    numberOfTeam,
    club,
    withClub,
    multiParticipants,
    validationParticipantsTeam,
  } = formOrder.data;

  const selectClassRef = React.useRef(null);
  const selectTypeRef = React.useRef(null);

  const [showModal, setShowModal] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");
  const [multipleUser, setMultipleUser] = React.useState([]);
  const filterClassCategoryGroup = React.useMemo(
    () =>
      groupClassCategory(
        eventCategories,
        selectCategoryTab,
        selectCategoriesType
      ),
    [selectCategoryTab, selectCategoriesType]
  );

  const handleTypeChangeRegistration = (value) => {
    setRegistrationType(value);
    if (value === "collective") {
      setIsColective(true);
    } else {
      setIsColective(false);
    }
  };

  const dataClass = React.useMemo(
    () => groupDataClass(filterClassCategoryGroup, selectClassCategories),
    [selectClassCategories, filterClassCategoryGroup]
  );

  const handleNextValidation = async () => {
    if (
      asParticipant &&
      isCollective === false &&
      selectCategoriesType === "individual"
    ) {
      const dataUser = {
        email: userProfile?.email,
        name: userProfile?.name,
        gender: userProfile?.gender,
        date_of_birth: userProfile?.dateOfBirth,
        country: userProfile?.isWna === 0 ? { id: 102, name: "indonesia" } : "",
        province: userProfile?.addressProvince,
        city: userProfile?.addressCity,
      };
      setListParticipants([dataUser]);
      goToNextStep();
    } else if (asParticipant === false && isCollective === false) {
      const { data } = await checkEmailIndividuParticipant(
        listParticipants[0]?.email
      );
      if (data?.data === null) {
        setModalMessage(data?.message);
        setShowModal(true);
        setEmailNotRegisteredList([listParticipants[0]?.email]);
        setEmailRegisteredList([]);
      } else {
        if (data?.message?.includes("sudah terdaftar sebagai user")) {
          const payload = {
            email: data?.data?.email,
            name: data?.data?.name,
            gender: data?.data?.gender,
            date_of_birth: data?.data?.dateOfBirth,
            country: data?.data?.country,
            province: data?.data?.province,
            city: data?.data?.city ?? "noCity",
          };
          setEmailRegisteredList([payload]);
          setEmailNotRegisteredList([]);
          setListParticipants([payload]);
          goToNextStep();
        }
      }
    } else {
      setMultiParticipants(multipleUser);
      goToNextStep();
    }
  };

  const handleChangeSelect = (val, index) => {
    if (formOrder) {
      switch (index) {
        case 0:
          setSelectCategoryTab(val);
          selectClassRef.current?.select.clearValue();
          selectTypeRef.current?.select.clearValue();
          break;
        case 1:
          setSelectCategoriesType(val);
          selectClassRef.current?.select.clearValue();
          break;
        default:
          if (selectCategoryTab && selectCategoriesType) {
            setSelectClassCategories(val);
          }
          break;
      }
    }
  };
  React.useEffect(() => {
    if (dataClass) {
      setCategory(dataClass, userProfile);
    }
  }, [dataClass]);

  React.useEffect(() => {
    if (isCollective) {
      if (asParticipant) {
        if (multiParticipants?.length) {
          const multipleUserData = multiParticipants?.filter(
            (e) => e.email === userProfile?.email
          );
          if (!multipleUserData.length) {
            setMultipleUser([
              {
                ...userProfile,
                value: userProfile?.email,
                label: userProfile?.email,
              },
              ...multiParticipants,
            ]);
          } else {
            setMultipleUser([...multiParticipants]);
          }
        } else {
          setMultipleUser([
            {
              ...userProfile,
              value: userProfile?.email,
              label: userProfile?.email,
            },
          ]);
        }
      } else {
        if (multiParticipants?.length) {
          const multipleUserData = multiParticipants?.filter(
            (e) => e.email !== userProfile?.email
          );
          if (multipleUserData.length) {
            setMultipleUser([...multipleUserData]);
          }
        }
      }
    } else {
      setMultipleUser([]);
    }
  }, [asParticipant, isCollective, multiParticipants]);

  const noChooseFormField =
    !category || parentClassificationId === 1
      ? selectCategoriesType === "individual"
        ? withClub === "yes"
          ? !club
          : !selectClassCategories
        : !club
      : parentClassificationId === 2
      ? !countryData
      : parentClassificationId === 3
      ? !provinceData
      : parentClassificationId === 4
      ? !city_id
      : false;
  const userAsParticipant = !asParticipant
    ? isCollective
      ? noChooseFormField || !multiParticipants.length
      : noChooseFormField || !listParticipants?.length
    : noChooseFormField;
  const noInputNumber =
    selectCategoriesType === "team"
      ? numberOfTeam < 1 || numberOfTeam * 3 > listParticipants?.length
      : selectCategoriesType === "mix"
      ? numberOfTeam < 1 || numberOfTeam * 2 > listParticipants?.length
      : userAsParticipant;
  const shouldDisableButton =
    noChooseFormField || noInputNumber || validationParticipantsTeam === false;
  return (
    <>
      <ContentCardLayout
        withHeaderTitle
        headerTitle={pageTitle && pageTitle.split("Pendaftaran ")[1]}
        title={"Kategori Lomba"}
      >
        <CategorySelect
          formOrder={formOrder}
          filterClassCategoryGroup={filterClassCategoryGroup}
          dataClass={dataClass}
          handleChangeSelect={handleChangeSelect}
          selectClassRef={selectClassRef}
          selectTypeRef={selectTypeRef}
          eventCategories={eventCategories}
        />
      </ContentCardLayout>

      {selectCategoriesType === "individual" ? (
        <ContentCardLayout title={"Detail Pendaftar"}>
          <DetailsRegistrant
            handleTypeChangeRegistration={handleTypeChangeRegistration}
            onProfileUpdated={onProfileUpdated}
            formOrder={formOrder}
            userProfile={userProfile}
          />
        </ContentCardLayout>
      ) : (
        <ClassificationType
          parentClassificationId={parentClassificationId}
          formOrder={formOrder}
          eventDetailData={eventDetailData}
        />
      )}
      {selectCategoriesType === "individual" ? (
        <ContentCardLayout title={"Detail Peserta"}>
          <DetailsParticipant
            formOrder={formOrder}
            userProfile={userProfile}
            eventDetailData={eventDetailData}
          />
          <PickerMatchDate
            category={category}
            value={matchDate}
            onChange={(date) => updateField({ matchDate: date })}
            errors={orderErrors.matchDate}
          />
        </ContentCardLayout>
      ) : (
        <ContentCardLayout title={"Detail Pendaftar"}>
          <DetailsRegistrant
            handleTypeChangeRegistration={handleTypeChangeRegistration}
            onProfileUpdated={onProfileUpdated}
            formOrder={formOrder}
            userProfile={userProfile}
          />
        </ContentCardLayout>
      )}

      {selectCategoriesType === "individual" ? (
        <ClassificationType
          parentClassificationId={parentClassificationId}
          formOrder={formOrder}
          eventDetailData={eventDetailData}
        />
      ) : (
        <ContentCardLayout title={"Detail Peserta"}>
          <DetailsParticipant
            formOrder={formOrder}
            userProfile={userProfile}
            eventDetailData={eventDetailData}
          />
          <PickerMatchDate
            category={category}
            value={matchDate}
            onChange={(date) => updateField({ matchDate: date })}
            errors={orderErrors.matchDate}
          />
        </ContentCardLayout>
      )}

      <StyledBSModal
        size="xl"
        isOpen={showModal}
        onClosed={() => setShowModal(false)}
      >
        <StyledBSModalBody>
          <div>
            <h5>Email Belum Terdaftar</h5>
            <p>{modalMessage}, apakah anda ingin melanjutkan?</p>
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
              Tidak
            </Button>
            <ButtonBlue onClick={() => goToNextStep()}>Lanjutkan</ButtonBlue>
          </div>
        </StyledBSModalBody>
      </StyledBSModal>

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
          onClick={() => history.back()}
        >
          Batalkan
        </Button>

        <ButtonBlue
          disabled={shouldDisableButton}
          onClick={handleNextValidation}
        >
          Selanjutnya
        </ButtonBlue>
      </ButtonSectionWrapper>
    </>
  );
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

const HeaderTitleText = styled.h1`
  color: #35405a;
  font-size: 1.5rem;
  font-weight: 600;
`;

const MainCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 0;
  border-bottom: 0.5px solid #dee2ee;
  margin-bottom: 0.75rem;
`;

const MainCardHeaderText = styled.h4`
  margin: 0;
  font-size: 1.25rem;
  color: #35405a;
  font-weight: 600;
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

const ButtonSectionWrapper = styled.span`
  margin-bottom: 2.875rem;
  display: flex;
  justify-content: space-between;
`;

const StyledBSModal = styled(Modal)`
  .modal-content {
    border-radius: 1.25rem;
  }
`;

const StyledBSModalBody = styled(ModalBody)`
  font-family: "Inter", sans-serif;
`;

const groupClassCategory = (
  data,
  selectedCategoryTab,
  selectedCategoriesType
) => {
  if (!selectedCategoryTab || !selectedCategoriesType) {
    return;
  }
  if (data) {
    const newData = data[selectedCategoryTab][selectedCategoriesType];
    const classCategoryArr = [];
    const labelCategoryArr = [];
    for (const categoryClass in newData) {
      classCategoryArr.push(newData[categoryClass]?.classCategory);
      labelCategoryArr.push(newData[categoryClass].categoryLabel);
    }
    const uniqueKeyClassCategory = [...new Set(classCategoryArr)];
    const result = {};
    const finalResult = [];
    for (const uniqueVal of uniqueKeyClassCategory) {
      result[uniqueVal] = {};
      result[uniqueVal].title = uniqueVal;
      result[uniqueVal].label = uniqueVal;
      result[uniqueVal].data = newData.filter((e) =>
        e.classCategory.includes(uniqueVal)
      );
      result[uniqueVal]?.data?.map((e) => {
        result[uniqueVal].categoryLabel = e.categoryLabel;
        result[uniqueVal].value = e.categoryLabel;
        if (e.genderCategory === "female") {
          result[uniqueVal].femaleQuota = e.quota;
          result[uniqueVal].femaleParticipant = e.totalParticipant;
          result[uniqueVal].femaleCanRegister = e.canRegister;
          result[uniqueVal].femaleIsOpen = e.isOpen;
          result[uniqueVal].femaleEarlyBird = e.earlyBird;
          result[uniqueVal].femaleEarlyPriceWna = e.earlyPriceWna;
          result[uniqueVal].femaleNormalPriceWna = e.normalPriceWna;
          result[uniqueVal].femaleIsEarlyBird = e.isEarlyBird;
          result[uniqueVal].femaleIisEarlyBirdWna = e.isEarlyBirdWna;
          result[uniqueVal].femaleFee = e.fee;
        } else if (e.genderCategory === "male") {
          result[uniqueVal].maleQuota = e.quota;
          result[uniqueVal].maleParticipant = e.totalParticipant;
          result[uniqueVal].maleCanRegister = e.canRegister;
          result[uniqueVal].maleIsOpen = e.isOpen;
          result[uniqueVal].maleEarlyBird = e.earlyBird;
          result[uniqueVal].maleEarlyPriceWna = e.earlyPriceWna;
          result[uniqueVal].maleNormalPriceWna = e.normalPriceWna;
          result[uniqueVal].maleIsEarlyBird = e.isEarlyBird;
          result[uniqueVal].maleIisEarlyBirdWna = e.isEarlyBirdWna;
          result[uniqueVal].maleFee = e.fee;
        } else if (e.genderCategory === "mix") {
          result[uniqueVal].mixQuota = e.quota;
          result[uniqueVal].mixParticipant = e.totalParticipant;
          result[uniqueVal].mixCanRegister = e.canRegister;
          result[uniqueVal].mixIsOpen = e.isOpen;
          result[uniqueVal].mixEarlyBird = e.earlyBird;
          result[uniqueVal].mixEarlyPriceWna = e.earlyPriceWna;
          result[uniqueVal].mixNormalPriceWna = e.normalPriceWna;
          result[uniqueVal].mixIsEarlyBird = e.isEarlyBird;
          result[uniqueVal].mixIisEarlyBirdWna = e.isEarlyBirdWna;
        }
        if (e.teamCategoryDetail.label.includes("Individu")) {
          result[uniqueVal].teamCategoryId = "Individu";
        } else if (e.teamCategoryDetail.label.includes("Beregu")) {
          result[uniqueVal].teamCategoryId = "Beregu";
        } else if (e.teamCategoryDetail.label.includes("Mix")) {
          result[uniqueVal].teamCategoryId = "Campuran";
        }
      });
      const classCategoryResult = {};
      classCategoryResult[uniqueVal] = result[uniqueVal];
      finalResult.push(result[uniqueVal]);
    }
    return finalResult;
  }
};

const groupDataClass = (data, selectClassCategories) => {
  if (!data || !selectClassCategories) return;
  const filterDataByClass = data?.filter(
    (e) => e.value === selectClassCategories
  );
  return filterDataByClass[0] || {};
};

const checkEmailIndividuParticipant = async (email) => {
  if (!email) return;
  let result = { status: "idle", errors: null, data: null };
  try {
    result = { status: "loading", errors: null, data: null };
    const payload = { emails: [email] };
    const response = await OrderEventService.checkEmailRegister(payload);
    if (response?.data && response.data[0]?.message) {
      result = {
        status: "success",
        errors: null,
        data: response.data[0],
      };
      return result;
    }
  } catch (error) {
    return error?.message;
  }
};
export { FormView };

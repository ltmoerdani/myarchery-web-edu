import * as React from "react";
import { useLocation } from "react-router-dom";
import { stringUtil } from "utils";

// Dibuat function, biar tiap formnya di-initiate,
// name-nya di field participant tergenerate string random baru

const _makeDefaultValues = () => ({
  category: null,
  selectCategoryUser: null,
  matchDate: null,
  registrationType: "individual",
  asParticipant: true,
  teamName: "",
  withClub: "yes",
  paymentMethode: "bankTransfer",
  genderOfTeam: "male",
  teamCategory: null,
  selectCategoryTab: null,
  selectCategoriesType: null,
  selectClassCategories: null,
  isCollective: false,
  numberOfTeam: 0,
  club: null,
  city_id: null,
  dataParticipant: [],
  multiParticipants: [],
  listParticipants: [],
  participants: [
    { name: `member-email-${stringUtil.createRandom()}`, data: null },
    { name: `member-email-${stringUtil.createRandom()}`, data: null },
    { name: `member-email-${stringUtil.createRandom()}`, data: null },
  ],
});

function useFormOrder({
  initialValues = _makeDefaultValues(),
  eventCategories,
  withContingen,
}) {
  const [form, dispatch] = React.useReducer(_formReducer, {
    data: initialValues,
    errors: {},
  });

  useDefaultCategoryFromParam({
    eventCategories: eventCategories,
    onParamFound: (category) => dispatch({ category: category }),
  });

  const isError = Object.keys(form.errors)?.length;

  const setRegistrationType = (value) =>
    dispatch({ type: "CHANGE_REGISTRATION_TYPE", payload: value });

  const setIsColective = (value) =>
    dispatch({ type: "CHANGE_REGISTRATION_COLLECTIVE_TYPE", payload: value });

  const setNumberOfTeam = (value) =>
    dispatch({ type: "CHANGE_NUMBER_OF_TEAM_TYPE", payload: value });

  const setGenderTeam = (value) =>
    dispatch({ type: "CHANGE_GENDER_TEAM_TYPE", payload: value });

  const setSelectCategoryTab = (value) =>
    dispatch({ type: "CHANGE_SELECT_CATEGORY_TAB_TYPE", payload: value });

  const setSelectCategoriesType = (value) =>
    dispatch({ type: "CHANGE_SELECT_CATEGORY_TYPE", payload: value });

  const setSelectClassCategories = (value) =>
    dispatch({ type: "CHANGE_SELECT_CLASS_CATEGORIES_TYPE", payload: value });

  const setAsParticipant = (value) =>
    dispatch({ type: "CHANGE_AS_PARTICIPANT", payload: value });

  const setListParticipants = (value) =>
    dispatch({ type: "ADD_LIST_PARTICIPANT_TYPE", payload: value });

  const setMultiParticipants = (value) =>
    dispatch({ type: "ADD_LIST_MULTI_PARTICIPANT_TYPE", payload: value });

  const setDataParticipants = (value) =>
    dispatch({ type: "ADD_DATA_PARTICIPANT_TYPE", payload: value });

  const setSelectCategoriesUser = (value) =>
    dispatch({ type: "ADD_CATEGORIES_USER_TYPE", payload: value });

  const setTeamCategory = (value) =>
    dispatch({ type: "CHANGE_TEAM_CATEGORY_TYPE", payload: value });

  const setCategory = (category, userProfile) => {
    dispatch({
      type: "CHANGE_CATEGORY",
      payload: category,
      default: userProfile,
    });
  };

  const setWithClub = (value) =>
    dispatch({ type: "CHANGE_WITH_CLUB", payload: value });
  const setPaymentMethode = (value) =>
    dispatch({ type: "CHANGE_PAYMENT_METHODE", payload: value });

  const setClub = (club) => {
    dispatch({ type: "CHANGE_CLUB", payload: club });
  };

  const setCityId = (city_id) => {
    dispatch({ type: "CHANGE_CITYID", payload: city_id });
  };

  const handleValidation = ({ onValid, onInvalid }) => {
    const errors = _validateFields({ ...form.data, withContingen });
    const isError = Object.keys(errors)?.length;

    dispatch({ type: "UPDATE_VALIDATION_ERRORS", errors: errors });

    if (isError) {
      onInvalid?.(errors);
    } else {
      onValid?.(form.data);
    }
  };

  return {
    ...form,
    isError,
    updateField: dispatch,
    setCategory,
    setClub,
    setWithClub,
    setCityId,
    handleValidation,
    setPaymentMethode,
    setRegistrationType,
    setAsParticipant,
    setIsColective,
    setNumberOfTeam,
    setGenderTeam,
    setSelectCategoryTab,
    setSelectCategoriesType,
    setSelectClassCategories,
    setListParticipants,
    setDataParticipants,
    setSelectCategoriesUser,
    setTeamCategory,
    setMultiParticipants,
  };
}

function _formReducer(state, action) {
  if (action.type === "CHANGE_CATEGORY") {
    // Kasih default user profile hanya kalau kategorinya individual
    // selain itu reset ke kosongan semua
    const nextParticipantsState = state.data.participants.map((member) => ({
      ...member,
      data: null,
    }));

    // cek date range marathon
    const hasOnlyOneRangeDate = action.payload.rangeDate?.length === 1;
    const matchDate = hasOnlyOneRangeDate
      ? datetime.parseServerDatetime(action.payload.rangeDate[0])
      : null;

    return {
      ...state,
      data: {
        ...state.data,
        category: action.payload,
        withClub: _isTeam(action.payload) ? "yes" : state.data.withClub,
        paymentMethode: state.data.paymentMethode,
        matchDate: matchDate,
        // reset field-field data peserta
        teamName: "",
        club: null,
        participants: nextParticipantsState,
      },
      errors: {},
    };
  }

  if (action.type === "CHANGE_REGISTRATION_TYPE") {
    const data = { ...state.data, registrationType: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_AS_PARTICIPANT") {
    const data = { ...state.data, asParticipant: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_REGISTRATION_COLLECTIVE_TYPE") {
    const data = { ...state.data, isCollective: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_NUMBER_OF_TEAM_TYPE") {
    const data = { ...state.data, numberOfTeam: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_SELECT_CATEGORY_TAB_TYPE") {
    const data = { ...state.data, selectCategoryTab: action.payload?.value };
    return { ...state, data: data };
  }

  if (action.type === "ADD_CATEGORIES_USER_TYPE") {
    const data = { ...state.data, selectCategoryUser: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "ADD_LIST_MULTI_PARTICIPANT_TYPE") {
    const data = { ...state.data, multiParticipants: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_SELECT_CATEGORY_TYPE") {
    const data = { ...state.data, selectCategoriesType: action.payload?.value };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_SELECT_CLASS_CATEGORIES_TYPE") {
    const data = {
      ...state.data,
      selectClassCategories: action.payload?.value,
    };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_GENDER_TEAM_TYPE") {
    const data = {
      ...state.data,
      genderOfTeam: action.payload,
    };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_TEAM_CATEGORY_TYPE") {
    const data = { ...state.data, teamCategory: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_WITH_CLUB") {
    const data = { ...state.data, withClub: action.payload, club: null };
    const errorsAfterReset = { ...state.errors };
    delete errorsAfterReset.club;
    delete errorsAfterReset.withClub;
    return { ...state, data: data, errors: errorsAfterReset };
  }

  if (action.type === "CHANGE_PAYMENT_METHODE") {
    const data = { ...state.data, paymentMethode: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "ADD_LIST_PARTICIPANT_TYPE") {
    const data = { ...state.data, listParticipants: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "ADD_DATA_PARTICIPANT_TYPE") {
    const data = { ...state.data, dataParticipant: action.payload };
    return { ...state, data: data };
  }

  if (action.type === "CHANGE_CLUB") {
    const data = { ...state.data, club: action.payload };
    const errorsAfterReset = { ...state.errors };
    delete errorsAfterReset.club;
    return { ...state, data: data, errors: errorsAfterReset };
  }

  if (action.type === "CHANGE_CITYID") {
    const data = { ...state.data, city_id: action.payload };
    const errorsAfterReset = { ...state.errors };
    delete errorsAfterReset.club;
    return { ...state, data: data, errors: errorsAfterReset };
  }

  if (action.type === "FIELD_MEMBER_EMAIL") {
    const nextParticipantsState = state.data.participants.map((member) => {
      if (member.name === action.name) {
        return { ...member, data: action.payload };
      }
      return member;
    });

    return {
      ...state,
      data: { ...state.data, participants: nextParticipantsState },
    };
  }

  if (action.type === "UPDATE_VALIDATION_ERRORS") {
    return {
      ...state,
      errors: action.errors,
    };
  }

  if (action && typeof action.type === "undefined") {
    return {
      ...state,
      data: { ...state.data, ...action },
    };
  }

  return state;
}

/* =================================== */

function useDefaultCategoryFromParam({ eventCategories, onParamFound }) {
  const { search } = useLocation();

  const qs_category_id = new URLSearchParams(search).get("categoryId");
  const categoryId = qs_category_id ? parseInt(qs_category_id) : qs_category_id;

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

    category && onParamFound?.(category);
  }, [eventCategories]);
}

/* =================================== */
// utils

function _isTeam(category) {
  if (!category) {
    return false;
  }
  return category.categoryTeam?.toLowerCase?.() === "team";
}

function _validateFields(data) {
  const { category, matchDate, withClub, club, city_id, withContingen } = data;
  const isTeam = _isTeam(category);
  let validationErrors = {};

  if (withContingen && !city_id?.value) {
    validationErrors = {
      ...validationErrors,
      city_id: ["Kontingen harus dipilih"],
    };
  }

  if (!withContingen && category?.id && isTeam && withClub == "no") {
    validationErrors = {
      ...validationErrors,
      withClub: ["Kategori beregu harus mewakili klub"],
    };
  }

  if (!withContingen && category?.id && !club?.detail.id && withClub == "yes") {
    validationErrors = { ...validationErrors, club: ["Klub harus dipilih"] };
  }

  // Kategori tim secara umum
  if (
    !withContingen &&
    category?.id &&
    ["individu male", "individu female", "individu_mix"].every(
      (team) => team !== category?.teamCategoryId
    )
  ) {
    if (!withContingen && !club?.detail.id) {
      validationErrors = { ...validationErrors, club: ["Klub harus dipilih"] };
    }
  }

  // Harus isi tanggal untuk kategori event marathon
  if (category?.isMarathon && !matchDate) {
    validationErrors = {
      ...validationErrors,
      matchDate: ["Tanggal bertanding wajib diisi"],
    };
  }

  return validationErrors;
}

export { useFormOrder };

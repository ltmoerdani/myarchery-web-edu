import * as React from "react";

const _makeDefaultValues = () => ({
  isWna: 0,

  // data wni
  province: null,
  city: null,
  nik: "",
  imageKTP: {
    raw: null,
    preview: "",
    url: "",
  },
  address: "",

  // data wna
  wnaCountry: null,
  wnaCity: null,
  wnaPassportNumber: "",
  imagePassport: {
    raw: null,
    preview: "",
    url: "",
  },
  wnaAddress: "",
});

function useFormVerification(verificationDetail) {
  const preservedInitialValues = React.useRef(_makeDefaultValues());

  const [form, dispatch] = React.useReducer(_formReducer, {
    data: preservedInitialValues.current,
    errors: {},
  });

  React.useEffect(() => {
    if (!verificationDetail) {
      return;
    }
    const initialValues = _makeInitialValuesState(verificationDetail);
    preservedInitialValues.current = initialValues;
    dispatch({ type: "INIT", payload: initialValues });
  }, [verificationDetail]);

  const isDirty = React.useMemo(
    () => _checkFormIsDirty(preservedInitialValues.current, form.data),
    [form.data]
  );

  const updateField = (field, value) => dispatch({ [field]: value });

  const updateNIK = (value) => dispatch({ type: "CHANGE_NIK", payload: value });

  const updateImage = (field, value) => {
    dispatch({ type: "CHANGE_IMAGE_FIELD", field: field, payload: value });
  };

  const updateWithDependence = (field, value, dependence) => {
    dispatch({
      type: "CHANGE_FIELD_WITH_DEPENDENCY",
      field: field,
      payload: value,
      dependence: dependence,
    });
  };

  return {
    ...form,
    isDirty,
    updateField,
    updateNIK,
    updateImage,
    updateWithDependence,
  };
}

function _formReducer(state, action) {
  if (action.type === "INIT") {
    const data = action.payload;
    return { ...state, data: data, errors: {} };
  }

  if (action.type === "CHANGE_NIK") {
    const nik = action.payload?.toString?.().length > 16 ? state.data.nik : action.payload;
    return {
      ...state,
      data: { ...state.data, nik: nik },
    };
  }

  if (action.type === "CHANGE_IMAGE_FIELD") {
    return {
      ...state,
      data: {
        ...state.data,
        [action.field]: {
          url: state.data[action.field].url,
          preview: action.payload.preview,
          raw: action.payload.raw,
        },
      },
    };
  }

  if (action.type === "CHANGE_FIELD_WITH_DEPENDENCY") {
    return {
      ...state,
      data: {
        ...state.data,
        [action.field]: action.payload,
        [action.dependence]: null,
      },
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
// utils

function _makeInitialValuesState(verificationDetail) {
  const defaultValues = _makeDefaultValues();

  if (!verificationDetail) {
    return defaultValues;
  }

  if (!verificationDetail.isWna) {
    const cityId = parseInt(verificationDetail.addressCityId) || "";
    const provinceId = parseInt(verificationDetail.addressProvinceId) || "";

    return {
      ...defaultValues,
      // data wni
      isWna: verificationDetail.isWna,
      province: {
        value: provinceId,
        label: verificationDetail.detailProvince.name || "",
      },
      city: {
        value: cityId,
        label: verificationDetail.detailCity.name || "",
      },
      nik: verificationDetail.nik || "",
      imageKTP: {
        raw: null,
        preview: "",
        url: verificationDetail.ktpKk || "",
      },
      address: verificationDetail.address || "",
    };
  }

  const countryId = parseInt(verificationDetail.countryId) || "";
  const cityId = parseInt(verificationDetail.cityOfCountryId) || "";

  return {
    ...defaultValues,
    // data wna
    isWna: verificationDetail.isWna,
    wnaCountry: {
      value: countryId,
      label: verificationDetail.detailCountry.name || "",
    },
    wnaCity: {
      value: cityId,
      label: verificationDetail.detailCityCountry.name || "",
    },
    wnaPassportNumber: verificationDetail.passportNumber || "",
    imagePassport: {
      raw: null,
      preview: "",
      url: verificationDetail.passportImg || "",
    },
    wnaAddress: verificationDetail.address || "",
  };
}

function _checkFormIsDirty(preservedInitialValues, values) {
  let isDirty = false;
  for (const field in values) {
    if (_isOptionField(field, ["city", "province", "wnaCountry", "wnaCity"])) {
      if (values[field]?.value !== preservedInitialValues[field]?.value) {
        isDirty = true;
        break;
      } else {
        continue;
      }
    } else if (values[field] !== preservedInitialValues[field]) {
      isDirty = true;
      break;
    }
  }
  return isDirty;
}

function _isOptionField(field, fieldList) {
  return fieldList.indexOf(field) > -1;
}

export { useFormVerification };

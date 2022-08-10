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

  const handleValidation = ({ onValid, onInvalid }) => {
    const errors = _validateFields(form.data);
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
    isDirty,
    updateField,
    updateNIK,
    updateImage,
    updateWithDependence,
    handleValidation,
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
        label: verificationDetail.detailProvince?.name || "",
      },
      city: {
        value: cityId,
        label: verificationDetail.detailCity?.name || "",
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
      label: verificationDetail.detailCountry?.name || "",
    },
    wnaCity: {
      value: cityId,
      label: verificationDetail.detailCityCountry?.name || "",
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

function _validateFields(data) {
  if (typeof data.isWna === "undefined") {
    return {
      isWna: ["Kewarganegaraan wajib diisi"],
    };
  }

  // WNI
  if (!data.isWna) {
    const errors = {};
    const FIELD_PROVINCE = "province";
    const FIELD_CITY = "city";
    const FIELD_NIK = "nik";
    const FIELD_KTP = "imageKTP";
    const FIELD_ADDRESS = "address";

    if (!data[FIELD_PROVINCE]?.value) {
      errors[FIELD_PROVINCE] = _addErrorMessageToField(
        errors[FIELD_PROVINCE],
        "Provinsi wajib diisi"
      );
    }

    if (!data[FIELD_CITY]?.value) {
      errors[FIELD_CITY] = _addErrorMessageToField(errors[FIELD_CITY], "Kota wajib diisi");
    }

    if (!data[FIELD_NIK]) {
      errors[FIELD_NIK] = _addErrorMessageToField(errors[FIELD_NIK], "NIK/nomor KK wajib diisi");
    }

    if (!data[FIELD_KTP]?.url && !data[FIELD_KTP]?.raw) {
      errors[FIELD_KTP] = _addErrorMessageToField(errors[FIELD_KTP], "File KTP/KK wajib dipilih");
    }

    if (data[FIELD_KTP]?.raw?.size > 2000000) {
      errors[FIELD_KTP] = _addErrorMessageToField(
        errors[FIELD_KTP],
        "Ukuran file KTP/KK tidak boleh melebihi 2MB"
      );
    }

    if (!data[FIELD_ADDRESS]) {
      errors[FIELD_ADDRESS] = _addErrorMessageToField(
        errors[FIELD_ADDRESS],
        "Alamat lengkap wajib diisi"
      );
    }

    return errors;
  }

  // WNA
  const errors = {};
  const FIELD_COUNTRY = "wnaCountry";
  const FIELD_CITY = "wnaCity";
  const FIELD_PASSPORT_NO = "wnaPassportNumber";
  const FIELD_PASSPORT = "imagePassport";
  const FIELD_ADDRESS = "wnaAddress";

  if (!data[FIELD_COUNTRY]?.value) {
    errors[FIELD_COUNTRY] = _addErrorMessageToField(errors[FIELD_COUNTRY], "Negara wajib diisi");
  }

  if (!data[FIELD_CITY]?.value) {
    errors[FIELD_CITY] = _addErrorMessageToField(
      errors[FIELD_CITY],
      "Kota negara asal wajib diisi"
    );
  }

  if (!data[FIELD_PASSPORT_NO]) {
    errors[FIELD_PASSPORT_NO] = _addErrorMessageToField(
      errors[FIELD_PASSPORT_NO],
      "Nomor passport wajib diisi"
    );
  }

  if (!data[FIELD_PASSPORT]?.url && !data[FIELD_PASSPORT]?.raw) {
    errors[FIELD_PASSPORT] = _addErrorMessageToField(
      errors[FIELD_PASSPORT],
      "File paspor wajib dipilih"
    );
  }

  if (data[FIELD_PASSPORT]?.raw?.size > 2000000) {
    const message = "Ukuran file paspor tidak boleh melebihi 2MB";
    errors[FIELD_PASSPORT] = _addErrorMessageToField(errors[FIELD_PASSPORT], message);
  }

  if (!data[FIELD_ADDRESS]) {
    errors[FIELD_ADDRESS] = _addErrorMessageToField(
      errors[FIELD_ADDRESS],
      "Alamat lengkap wajib diisi"
    );
  }

  return errors;
}

function _addErrorMessageToField(existingMessages, message) {
  const updatedMessages = existingMessages ? [...existingMessages] : [];
  updatedMessages.push(message);
  return updatedMessages;
}

export { useFormVerification };

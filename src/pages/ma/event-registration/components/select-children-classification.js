import * as React from "react";
import { GeneralService } from "services";

import { AsyncPaginate } from "react-select-async-paginate";
import { customSelectStyles } from "./select-option";

const FETCHING_LIMIT = 30;

function SelectChildrenClassifiaction({
  name,
  placeholder,
  parentId,
  value,
  onChange,
  errors,
  disabled,
}) {
  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    const result = await GeneralService.getChildrenClassification({
      limit: FETCHING_LIMIT,
      page: page,
      name: searchQuery,
      type: "with-parent",
      parent_id: parentId,
    });
    const options = result.data.data.map((classification) => ({
      label: classification.title,
      value: parseInt(classification.id),
    }));

    return {
      options: options,
      hasMore: result.data.length >= FETCHING_LIMIT,
      additional: { page: page + 1 },
    };
  };

  return (
    <AsyncPaginate
      key={parentId}
      styles={computeCustomStylesWithValidation(errors)}
      name={name}
      loadOptions={loadOptions}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      isSearchable
      debounceTimeout={200}
      additional={{ page: 1 }}
      isDisabled={disabled}
    />
  );
}

const computeCustomStylesWithValidation = (errors) => {
  if (errors?.length) {
    return {
      ...customSelectStyles,
      control: (provided) => ({
        ...provided,
        border: "solid 1px var(--ma-red)",
      }),
    };
  }
  return customSelectStyles;
};

export { SelectChildrenClassifiaction };

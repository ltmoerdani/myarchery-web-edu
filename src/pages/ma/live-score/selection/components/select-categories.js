import * as React from "react";
import { useCategoryDetails } from "../hooks/category-details";

import Select from "react-select";
import { useFilters, FilterProvider } from "components/ma/toolbar-filters";

const CategoryDetailContext = React.createContext();

function CategoryProvider({ eventId, children }) {
  const { data: categories } = useCategoryDetails(eventId);
  return (
    <FilterProvider categories={categories || []}>
      <CategoryDetailProvider>{children}</CategoryDetailProvider>
    </FilterProvider>
  );
}

function CategoryDetailProvider({ children }) {
  const { categoryDetails } = useFilters();
  const optionCategories = _makeOptionCategories(categoryDetails);

  return (
    <CategoryDetailContext.Provider value={{ optionCategories }}>
      {children}
    </CategoryDetailContext.Provider>
  );
}

function SelectCategories() {
  const { optionCategories } = React.useContext(CategoryDetailContext);
  console.log(optionCategories);
  return <Select options={optionCategories} />;
}

function _makeOptionCategories(categoryDetails) {
  if (!categoryDetails) {
    return [];
  }
  const values = {};
  Object.keys(categoryDetails).forEach((competitionCategory) => {
    Object.keys(categoryDetails[competitionCategory]).forEach((classCategory) => {
      const label = `${competitionCategory} - ${classCategory}`;
      values[label] = { competitionCategory, classCategory };
    });
  });

  const options = Object.keys(values).map((value) => {
    return { label: value, value: values[value] };
  });

  return options;
}

export { CategoryProvider, SelectCategories };

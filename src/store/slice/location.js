import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provinces: null,
  cities: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setProvinces: (state, action) => {
      state.provinces = action.payload;
    },
    setCities: (state, action) => {
      state.cities = action.payload;
    },
  },
});

export const getLocationStore = (state) => state.location;

// Action creators are generated for each case reducer function
export const { setProvinces, setCities } = locationSlice.actions;

export default locationSlice.reducer;

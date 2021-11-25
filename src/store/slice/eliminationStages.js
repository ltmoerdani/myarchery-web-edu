import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: { id: 1, key: 1, label: "Individu-U-16-Compound-30m" },
  gender: { id: "male", label: "Laki-laki" },
};

export const stagesSlice = createSlice({
  name: "eliminationStages",
  initialState,
  reducers: {
    selectGender: (state, action) => {
      state.gender = action.payload;
    },
    selectCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const getEliminationStagesStore = (state) => state.eliminationStages;

export const { selectCategory, selectGender } = stagesSlice.actions;

export default stagesSlice.reducer;

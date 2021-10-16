import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isLoggedIn: false,
  user: null,
}

export const archerSlice = createSlice({
  name: "archer",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true
      state.user = action.payload
    },
    logout: state => {
      state.isLoggedIn = false
    },
    register: state => {
      state.isLoggedIn = true
      state.user = null
    },
  },
})

export const getArcherStore = state => state.archer

// Action creators are generated for each case reducer function
export const { login, logout, register } = archerSlice.actions

export default archerSlice.reducer

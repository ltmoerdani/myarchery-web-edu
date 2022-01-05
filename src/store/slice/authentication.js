import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isLoggedIn: false,
  user: null,
  userProfile: null,
}

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true
      state.user = action.payload
    },
    profile: (state, action) => {
      state.userProfile = action.payload
    },
    logout: state => {
      state.isLoggedIn = false
      state.user = null
      state.userProfile = null
    },
    register: state => {
      state.isLoggedIn = true
      state.user = null
    },
  },
})

export const getAuthenticationStore = state => state.authentication

// Action creators are generated for each case reducer function
export const { login, profile, logout, register } = authenticationSlice.actions

export default authenticationSlice.reducer

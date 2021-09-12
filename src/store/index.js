import { combineReducers } from 'redux'
import { configureStore } from "@reduxjs/toolkit"
import {
  FLUSH, PAUSE,
  PERSIST, persistReducer, PURGE,
  REGISTER, REHYDRATE
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import authenticationReducer from "./slice/authentication"


const persistConfig = {
  key: "archery",
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  authentication: authenticationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
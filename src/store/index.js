import { combineReducers } from 'redux'
import { configureStore } from "@reduxjs/toolkit"
import {
  FLUSH, PAUSE,
  PERSIST, persistReducer, PURGE,
  REGISTER, REHYDRATE
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import authenticationReducer from "./slice/authentication"
import archerReducer from "./slice/archer"
import eventReducer from "./slice/events"
import eliminationStagesReducer from "./slice/eliminationStages"


const persistConfig = {
  key: "archery",
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  archer: archerReducer,
  events: eventReducer,
  eliminationStages: eliminationStagesReducer,
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

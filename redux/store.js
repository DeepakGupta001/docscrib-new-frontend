import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState
  });
}

// Default store (for non-hydrated usage)
const store = makeStore();
export default store;

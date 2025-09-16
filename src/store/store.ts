import { configureStore } from "@reduxjs/toolkit";
import docReducer from "./docSlice";

const store = configureStore({
  reducer: {
    doc: docReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

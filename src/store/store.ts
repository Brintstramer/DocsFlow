import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import docReducer from "./docSlice";

const store = configureStore({
  reducer: {
    doc: docReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;

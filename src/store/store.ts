import { configureStore } from "@reduxjs/toolkit";
import docReducer from "./docSlice";
import authReducer from "./authSlice";
import editorReducer from "./editorSlice";

const store = configureStore({
  reducer: {
    doc: docReducer,
    auth: authReducer,
    editor: editorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

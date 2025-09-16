import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./thunk";
import type { User } from "../types/authTypes";
//comment

interface InitialState {
  userData: User | null;
  isAuth: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: InitialState = {
  userData: null,
  isAuth: false,
  loading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // tokenManager.clearToken();
      localStorage.removeItem("token");
      // state.userData = null;
      state.isAuth = false;
      // state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.success = true;
        state.userData = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка при авторизации";
        state.isAuth = false;
        state.userData = null;
      });
  },
});

export const { logout, clearError, resetSuccess } = authSlice.actions;
export default authSlice.reducer;

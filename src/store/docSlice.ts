import { createSlice } from "@reduxjs/toolkit";
import { fetchPersonal, fetchTemplates, genWordDoc } from "./docThunk";
import type { Person, Templates } from "../types/types";

interface InitialState {
  templates: Templates | null;
  personal: Person[];
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  templates: null,
  personal: [],
  loading: false,
  error: null,
};

const docSlice = createSlice({
  name: "doc",
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setPersonal: (state, action) => {
      state.personal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка";
      })
      .addCase(fetchPersonal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonal.fulfilled, (state, action) => {
        state.loading = false;
        state.personal = action.payload;
      })
      .addCase(fetchPersonal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка";
      })
      .addCase(genWordDoc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(genWordDoc.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(genWordDoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка";
      });
  },
});

export default docSlice.reducer;

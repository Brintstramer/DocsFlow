import { createSlice } from "@reduxjs/toolkit";
import { approveDocument, setRoute } from "./thunk";
import type { Document } from "../types/types";

interface InitialState {
  documents: Document[];
  loading: boolean;
}

const initialState: InitialState = {
  documents: [],
  loading: false,
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setRoute.fulfilled, (state, action) => {
        const doc = action.payload;
        const idx = state.documents.findIndex((d) => d.id === doc.id);
        if (idx >= 0) {
          state.documents[idx] = doc;
        } else {
          state.documents.push(doc);
        }
      })
      .addCase(approveDocument.fulfilled, (state, action) => {
        const doc = action.payload;
        const idx = state.documents.findIndex((d) => d.id === doc.id);
        if (idx >= 0) state.documents[idx] = doc;
      });
  },
});

export default routesSlice.reducer;

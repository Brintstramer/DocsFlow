// store/editorSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DocumentVersion } from "../types/types";

interface EditorState {
  title: string;
  content: string;
  author: string;
  selectedVersion: DocumentVersion | null;
  compareVersions: { old?: DocumentVersion; new?: DocumentVersion };
  isEdited: boolean;
}

const initialState: EditorState = {
  title: "",
  content: "",
  author: localStorage.getItem("lastAuthor") || "",
  selectedVersion: null,
  compareVersions: {},
  isEdited: false,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.isEdited = true;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
      state.isEdited = true;
    },
    setAuthor: (state, action: PayloadAction<string>) => {
      state.author = action.payload;
    },
    selectVersion: (state, action: PayloadAction<DocumentVersion>) => {
      state.selectedVersion = action.payload;
      state.isEdited = true;
    },
    setCompareVersions: (
      state,
      action: PayloadAction<{ old?: DocumentVersion; new?: DocumentVersion }>,
    ) => {
      state.compareVersions = action.payload;
    },
    resetEditor: (state) => {
      state.title = "";
      state.content = "";
      state.selectedVersion = null;
      state.compareVersions = {};
      state.isEdited = false;
    },
  },
});

export const {
  setTitle,
  setContent,
  setAuthor,
  selectVersion,
  setCompareVersions,
  resetEditor,
} = editorSlice.actions;
export default editorSlice.reducer;

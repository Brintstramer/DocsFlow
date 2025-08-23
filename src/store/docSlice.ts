import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
};

const docSlice = createSlice({
  name: "doc",
  initialState,
  reducers: {
    genStart: (st) => {
      state.loading = true;
      state.error = null;
    },
  },
});

export default docSlice.reducer;

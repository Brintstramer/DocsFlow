import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
};

const docSlice = createSlice({
  name: "doc",
  initialState,
  reducers: {
    genStart: (state) => {
      state.loading = true;
      state.error = null;
    },
  },
});

export default docSlice.reducer;

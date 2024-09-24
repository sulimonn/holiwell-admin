import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  opened: false,
  message: null,
  type: '',
};

export const snackbar = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    toggleSnackbar: (state, action) => {
      state.opened = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    closeSnackbar: (state) => {
      state.opened = false;
      state.message = null;
      state.type = '';
    },
  },
});

export const { toggleSnackbar, closeSnackbar } = snackbar.actions;

export default snackbar.reducer;

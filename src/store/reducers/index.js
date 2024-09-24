// third-party
import { combineReducers } from 'redux';

import auth from './auth';
import { apiSlice } from './apiSlice';
import snackbarSlice from './snackbar';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  snackbar: snackbarSlice,
  [auth.reducerPath]: auth.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default reducers;

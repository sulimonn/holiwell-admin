// third-party
import { combineReducers } from 'redux';

import auth from './auth';
import user from './users';
import { apiSlice } from './apiSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  [auth.reducerPath]: auth.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default reducers;

// third-party
import { combineReducers } from 'redux';

import auth from './auth';
import user from './users';
import { apiSlice } from './apiSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  [user.reducerPath]: user.reducer,
  [auth.reducerPath]: auth.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default reducers;

// third-party
import { combineReducers } from 'redux';

import auth from './auth';
import user from './users';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  [user.reducerPath]: user.reducer,
  [auth.reducerPath]: auth.reducer,
});

export default reducers;

// third-party
// eslint-disable-next-line import/no-extraneous-dependencies
import { combineReducers } from 'redux';

import user from './users';
import auth from './authApi';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  user,
  auth,
});

export default reducers;

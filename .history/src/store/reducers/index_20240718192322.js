// third-party
import { combineReducers } from 'redux';

import user from './users';
import auth from './auth';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  user,
  auth,
});

export default reducers;
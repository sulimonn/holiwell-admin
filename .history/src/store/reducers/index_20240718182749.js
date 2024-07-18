// third-party
// eslint-disable-next-line import/no-extraneous-dependencies
import { combineReducers } from 'redux';

import user from './users';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  user,
});

export default reducers;

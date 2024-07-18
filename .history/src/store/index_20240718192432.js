// third-party
// eslint-disable-next-line import/no-extraneous-dependencies
import { configureStore } from '@reduxjs/toolkit';

import reducers from './reducers';
import auth from './reducers/auth';
// project import
import user from './reducers/users';
import { apiSlice } from './reducers/apiSlice';

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(user.middleware, apiSlice.middleware, auth.middleware),
  devTools: true,
});

const { dispatch } = store;

export { store, dispatch };

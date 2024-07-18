// third-party
// eslint-disable-next-line import/no-extraneous-dependencies
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './reducers';
import user from './reducers/users';
import { apiSlice } from './reducers/apiSlice';

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(user.middleware, apiSlice.middleware),
  devTools: true,
});

const { dispatch } = store;

export { store, dispatch };

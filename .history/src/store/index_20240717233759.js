// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './reducers';

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
  devTools: true,
});

const { dispatch } = store;

export { store, dispatch };

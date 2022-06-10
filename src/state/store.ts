import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import application from './application';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['application'],
};

const applicationPersistConfig = {
  key: 'application',
  storage,
  whitelist: ['authData'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    application: persistReducer(applicationPersistConfig, application),
  })
);

const store: Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleWare = getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    });
    if (process.env.NODE_ENV !== 'production') middleWare.concat(logger);
    return middleWare;
  },

  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;

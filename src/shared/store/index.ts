// shared/store/index.ts
"use client";

import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from '@/lib/storage'; // Use our custom storage
import userSlice from '@/shared/store/user/userSlice';

const persistConfig = {
  key: 'root',
  storage, // Use the custom storage
  whitelist: ['userSlice'],
};

const persistedUserReducer = persistReducer(persistConfig, userSlice);

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      userSlice: persistedUserReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['store']['getState']>;
export type AppDispatch = AppStore['store']['dispatch'];

// Export initialized store and persistor
export const { store, persistor } = makeStore();
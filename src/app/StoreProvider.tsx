'use client'

import {useRef} from 'react'
import {AppStore, makeStore} from '@/shared/store'
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/shared/store';
import { Provider } from 'react-redux';

export default function StoreProvider({
                                          children
                                      }: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore()
    }

    return(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
    )
}
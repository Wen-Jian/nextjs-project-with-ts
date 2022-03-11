import React from 'react';
import { Store, createStore, compose } from 'redux';
import { StoreActions, StoreState } from '~/models/redux/storeModel';
import rootReducer from './reducers';

const store: Store<StoreState, StoreActions> & {
  dispatch: (arg: StoreActions) => StoreActions;
} = createStore(
  rootReducer,
  typeof window !== 'undefined' && process.env.NODE_ENV !== 'production'
    ? // @ts-ignore: Window & typeof globalThis
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        // @ts-ignore: Window & typeof globalThis
        window.__REDUX_DEVTOOLS_EXTENSION__()
    : compose
);

export default store;

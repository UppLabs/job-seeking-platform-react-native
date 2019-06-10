import { applyMiddleware, createStore, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reduxReset from 'redux-reset';
import reducers from './reducers';

export default function configureStore(initialState) {
  const isDebuggingEnabled = typeof atob !== 'undefined';

  const middlewares = [reduxThunk];

  const composeEnhancers = compose;

  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middlewares),
      reduxReset(),
      isDebuggingEnabled
        ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        : applyMiddleware()
    )
  );

  return { store, persistor: persistStore(store) };
}

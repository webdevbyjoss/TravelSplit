import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/app/App';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store';
import {persistor} from './store';
import {PersistGate} from 'redux-persist/integration/react'


ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
        <BrowserRouter>
            <PersistGate persistor={persistor}>
          <App />
            </PersistGate>
        </BrowserRouter>
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
  );

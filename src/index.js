import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import {BrowserRouter} from 'react-router-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './reducers/index';

const store = createStore(rootReducer);

ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
  );

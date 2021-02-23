import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import './i18n';
import './index.css';

import * as serviceWorker from './serviceWorker';
import App from './App';

import store from './store';

ReactDOM.render(
  <SnackbarProvider
    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    hideIconVariant
  >
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </SnackbarProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

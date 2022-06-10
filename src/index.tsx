import 'assets/styles/index.scss';
import store from 'state/store';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from 'routes/router';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

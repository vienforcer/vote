import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';

import routerMap from './rotuer/router';
const history = createHashHistory();// createBrowserHistory();

import tmpStore from './store';
const store = tmpStore();

const init = (RootElement) => {

  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Router history={history}>
          {RootElement}
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('voteRoot'));
};

init(routerMap(history));

if (module && module.hot) {
  module.hot.accept('./rotuer/router', () => {
    const getRouter1 = require('./rotuer/router').default;
    init(getRouter1(history));
  });
}


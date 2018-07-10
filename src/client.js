import React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';

const container = document.getElementById('app');
const render = Component => hydrate(
  <AppContainer>
    <Component />
  </AppContainer>,
  container,
);

render(App);

if (module.hot) {
  module.hot.accept('./App', () => render(require('./App').default));
}

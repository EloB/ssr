import React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

const container = document.getElementById('app');
const render = Component => hydrate(
  <AppContainer>
    <Component />
  </AppContainer>,
  container,
);

render(App);

if (module.hot) {
  module.hot.accept('./components/App', () => render(require('./components/App').default));
}

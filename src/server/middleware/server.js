import React from 'react';
import express from 'express';
import { renderToNodeStream } from 'react-dom/server';
import { AppContainer } from 'react-hot-loader';
import Html from '../Html';
import App from '../../App';

let AppComponent = App;

const app = express();

app.use((req, res) => renderToNodeStream(
  <Html javascriptSrc="/main.js">
    <AppComponent />
  </Html>
).pipe(res));

if (module.hot) {
  module.hot.accept('../../App', () => {
    AppComponent = require('../../App').default;
  });
}

export default app;

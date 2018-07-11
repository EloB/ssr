import React from 'react';
import express from 'express';
import { renderToNodeStream } from 'react-dom/server';
import Html from '../components/Html';
import App from '../components/App';

const components = { App, Html };

const app = express();

app.use((req, res, next) => {
  const stream = renderToNodeStream(
    <components.Html javascriptSrc="/web.js">
      <components.App />
    </components.Html>
  );

  stream.on('error', next);

  stream.pipe(res);
});

if (module.hot) {
  module.hot.accept([
    '../components/App',
    '../components/Html',
  ], () => {
    components.App = require('../components/App').default;
    components.Html = require('../components/Html').default;
  });
}

export default app;

import express from 'express';
import middleware from './middleware';

let serverMiddleware = middleware;

const app = express();

if (module.hot) {
  app.use((req, res, next) => serverMiddleware(req, res, next));
  module.hot.accept('./middleware', () => {
    serverMiddleware = require('./middleware').default;
  });
} else {
  app.use(serverMiddleware);
}

export default app;


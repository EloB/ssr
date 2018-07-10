import express from 'express';

const middleware = {};
const reloadMiddleware = () => Object.assign(middleware, {
  server: require('./middleware/server').default,
  client: require('./middleware/client').default,
});

reloadMiddleware();

const app = express();

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => middleware.server(req, res, next));
app.use((req, res, next) => middleware.client(req, res, next));

app.listen(PORT, (error) => {
  if (error) return console.error(error);
  console.log(`Webserver started on ${PORT}`)
});

if (module.hot) {
  module.hot.accept([
    './middleware/server',
    './middleware/client',
  ], reloadMiddleware);
}

export default app;

import React from 'react';

const Html = ({ children, javascriptSrc }) => (
  <html>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <title>App</title>
    </head>
    <body>
      <div id="app">{children}</div>
      <script src={javascriptSrc} />
    </body>
  </html>
);

export default Html;

'use strict';

module.exports = (api, app) => {

  app.get('/hello/*', (req, res) => {
    res.json({ hello: 'world' });
  });

};
'use strict';

module.exports = (api, app) => {

  app.get('/alpha', (req, res) => {
    res.json({ hello: 'alpha' });
  });

};
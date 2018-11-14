'use strict';

module.exports = (api, app) => {

  app.get('/beta', (req, res) => {
    res.json({ hello: 'beta' });
  });

};
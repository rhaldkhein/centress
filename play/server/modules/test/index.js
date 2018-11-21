'use strict';

exports.centress = centress => {
  return {

    prefix: '/test',
    // index: 1,

    init: function (app, server) {

      app.get('/test/bar', (req, res) => {
        res.json({ test: 'bar' });
      });

    },

    routes: (moduleRouter, baseRouter) => {

      moduleRouter.get('/test/world', (req, res) => {
        res.json({ test: 'world' });
      });

      baseRouter.get('/test/foo', (req, res) => {
        res.json({ test: 'foo' });
      });

    }

  };
};
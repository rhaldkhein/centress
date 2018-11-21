'use strict';

exports.centress = centress => {
  return {

    // prefix: '/test',
    // index: 1,

    init: function (app, server) {

      app.get('/foo/bar', (req, res) => {
        res.json({ foo: 'bar' });
      });

    },

    routes: (moduleRouter, baseRouter) => {

      moduleRouter.get('/foo/world', (req, res) => {
        res.json({ foo: 'world' });
      });

      baseRouter.get('/foo/foo', (req, res) => {
        res.json({ foo: 'foo' });
      });

    }

  };
};
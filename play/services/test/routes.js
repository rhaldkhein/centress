'use strict';

module.exports = (service) => {

  service.get('/hello', (req, res) => {
    res.json({ hello: 'world 2' });
  });

};
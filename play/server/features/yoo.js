'use strict';

const centress = require('../../../src');

centress.module(exports, {
  index: Number.MIN_SAFE_INTEGER,
  init: main => {
    console.log('A', main.config);
  }
});

exports.funcYoo = 'The Yoo';
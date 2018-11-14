// Clustering express routers accross nodes over http

const express = require('express');
const app = express();
const centress = require('centress');

// Create a remote router
centress.router(
  {
    server: app,
    entry: '/alpha',
    host: 'localhost',
    post: 3001
  }
);


// - - -

const request = require('request');

function router(req, res, next) {

}
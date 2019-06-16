const { Centress } = require('../../build')
const registry = require('./registry')

const centress = new Centress()

centress
  .build(registry)
  .start()
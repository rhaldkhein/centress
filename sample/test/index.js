const { core } = require('../../build')
const registry = require('./registry')
const configure = require('./configure')

const app = core()

app
  .build(registry, configure)
  .start()
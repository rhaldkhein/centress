const Foo = require('./services/foo')
const Bar = require('./services/bar')
const Yoo = require('./services/yoo')
const Baz = require('./services/baz')

module.exports = services => {

  services.addSingleton(Foo)
  services.addSingleton(Bar)

  services.addTransient(Yoo)
  services.addTransient(Baz)

}
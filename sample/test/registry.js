const Foo = require('./foo')

module.exports = services => {
  services.addSingleton(Foo)
}
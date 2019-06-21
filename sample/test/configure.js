
const config = {
  $server: {},
  foo: {
    name: 'Foo'
  },
  bar: {
    name: 'Bar'
  },
  yoo: {
    name: 'Yoo'
  }
}

module.exports = app => {

  app.useConfig(config)

  app.useServiceRoutes()

}
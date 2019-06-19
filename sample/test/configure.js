
const config = {
  $server: {
    // port: 3001
  },
  foo: {
    bar: 'Kevin'
  }
}

module.exports = app => {

  app.useConfig(config)

  app.useServiceRoutes()

}